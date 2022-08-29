package com.vikadata.social.wecom;

import java.time.Duration;
import java.util.Map;

import javax.net.ssl.SSLContext;

import cn.hutool.cache.CacheUtil;
import cn.hutool.cache.impl.TimedCache;
import cn.hutool.core.util.StrUtil;
import com.google.common.collect.Maps;
import me.chanjar.weixin.common.redis.RedisTemplateWxRedisOps;
import me.chanjar.weixin.common.redis.WxRedisOps;
import me.chanjar.weixin.cp.api.WxCpService;
import me.chanjar.weixin.cp.api.impl.WxCpServiceImpl;
import me.chanjar.weixin.cp.config.impl.WxCpDefaultConfigImpl;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContexts;
import org.apache.http.ssl.TrustStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.social.wecom.config.WeComRedisConfigImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

/**
 * <p>
 * 企业微信模板操作抽象类
 * </p>
 *
 * @author Pengap
 * @date 2021/7/28 16:51:41
 */
public abstract class AbstractWeComTemplate {

    protected static final Logger LOGGER = LoggerFactory.getLogger(AbstractWeComTemplate.class);

    private final static String CONFIG_KEY = "work_weixin:config:";

    private final static String TEMP_CONFIG_KEY = "work_weixin:temp_config:";

    @Autowired(required = false)
    private StringRedisTemplate stringRedisTemplate;

    private final RestTemplate restTemplate;

    protected WeComConfig weComConfig;

    // key：corpId + agentId
    protected static Map<String, WxCpService> cpServices = Maps.newConcurrentMap();

    // key：corpId + agentId , 缓存临时授权的服务，默认超时时间2小时
    protected static TimedCache<String, WxCpService> cpServicesByTempAuth = CacheUtil.newTimedCache(Duration.ofHours(2).toMillis());

    public AbstractWeComTemplate() {
        this.restTemplate = createRestTemplate();
    }

    /**
     * 抽象的开启API的Service
     *
     * @return 微信API的Service
     */
    public abstract WxCpService openService();

    /**
     * 抽象的关闭API的Service
     */
    public abstract void closeService();

    /**
     * 获取企业微信基础公共配置
     */
    public WeComConfig getConfig() {
        return weComConfig;
    }

    /**
     * 合并key
     */
    public String mergeKey(String corpId, Integer agentId) {
        return String.format("%s-%s", corpId, agentId);
    }

    /**
     * 获取缓存配置文件前缀
     */
    public String getCacheConfigKeyPrefix() {
        return getCacheConfigKeyPrefix(false);
    }

    /**
     * 获取缓存配置文件前缀
     *
     * @param isTemp    是否临时
     */
    public String getCacheConfigKeyPrefix(boolean isTemp) {
        String prefix = StrUtil.isBlank(weComConfig.getKeyPrefix()) ? "" : StrUtil.appendIfMissing(weComConfig.getKeyPrefix(), ":");
        return prefix + (isTemp ? TEMP_CONFIG_KEY : CONFIG_KEY);
    }

    /**
     * 查询当前是否缓存服务
     * 无法查询临时授权服务
     *
     * @param key   缓存key
     */
    public boolean isExistService(String key) {
        return isExistService(key, false);
    }

    /**
     * 查询当前是否缓存服务
     *
     * @param key               缓存key
     * @param isTempAuthService 查询临时服务
     */
    public boolean isExistService(String key, boolean isTempAuthService) {
        if (isTempAuthService) {
            return cpServicesByTempAuth.containsKey(key);
        }
        return cpServices.containsKey(key);
    }

    /**
     * 动态添加企业微信服务类
     *
     * @param corpId 企业Id
     * @param agentId 应用Id
     * @param agentSecret 应用密钥
     */
    public WxCpService addService(String corpId, Integer agentId, String agentSecret) {
        return addService(corpId, agentId, agentSecret, false, -1);
    }

    /**
     * 动态添加企业微信服务类
     *
     * @param corpId            企业Id
     * @param agentId           应用Id
     * @param agentSecret       应用密钥
     * @param isTempAuthService 是否临时授权
     * @param timeout           临时授权超时时间
     */
    public WxCpService addService(String corpId, Integer agentId, String agentSecret, boolean isTempAuthService, long timeout) {
        WxCpService service;
        String key = this.mergeKey(corpId, agentId);
        if (!isTempAuthService) {
            switch (weComConfig.getStorageType()) {
                case "memory": {
                    service = this.memoryBulid(corpId, agentId, agentSecret);
                    break;
                }
                case "redis": {
                    service = this.redisBulid(corpId, agentId, agentSecret);
                    break;
                }
                default:
                    throw new IllegalStateException("构造企业微信服务【" + weComConfig.getStorageType() + "】策略不存在.");
            }
            cpServices.put(key, service);
        }
        else {
            // 临时授权服务无法使用 Redis模式，自动切换为内存构建模式
            service = this.memoryBulid(corpId, agentId, agentSecret);
            cpServicesByTempAuth.put(key, service, timeout);
            return service;
        }
        return service;
    }

    /**
     * 使用内存方式构建Service
     */
    private WxCpService memoryBulid(String corpId, Integer agentId, String agentSecret) {
        WxCpService service = new WxCpServiceImpl();
        WxCpDefaultConfigImpl configStorage = new WxCpDefaultConfigImpl();
        configStorage.setCorpId(corpId);
        configStorage.setAgentId(agentId);
        configStorage.setCorpSecret(agentSecret);
        service.setWxCpConfigStorage(configStorage);
        // 由于没有配置回调业务，这里不实例化 tiken、aesKey
        return service;
    }

    /**
     * 使用Redis方式构建Service
     */
    private WxCpService redisBulid(String corpId, Integer agentId, String agentSecret) {
        WxCpService service = new WxCpServiceImpl();
        if (null == stringRedisTemplate) {
            throw new RuntimeException("构造失败：当前无法获取Redis连接，可以尝试使用：Memory模式.");
        }
        WxRedisOps redisOps = new RedisTemplateWxRedisOps(stringRedisTemplate);

        WeComRedisConfigImpl configStorage = new WeComRedisConfigImpl(redisOps, weComConfig.getKeyPrefix());
        configStorage.setCorpId(corpId);
        configStorage.setAgentId(agentId);
        configStorage.setCorpSecret(agentSecret);
        service.setWxCpConfigStorage(configStorage);
        return service;
    }

    /**
     * 移除临时授权服务
     */
    public void removeCpServicesByTempAuth(String key) {
        cpServicesByTempAuth.remove(key);
    }

    /**
     * 创建RestTemplate
     */
    private RestTemplate createRestTemplate() {
        RestTemplate client = new RestTemplate();
        client.setRequestFactory(generateHttpsRequestFactory());
        return client;
    }

    /**
     * 获取RestTemplate
     */
    protected RestTemplate getRestTemplate() {
        return restTemplate;
    }

    /**
     * https请求工厂
     */
    public HttpComponentsClientHttpRequestFactory generateHttpsRequestFactory() {
        try {
            TrustStrategy acceptingTrustStrategy = (x509Certificates, authType) -> true;
            SSLContext sslContext = SSLContexts.custom().loadTrustMaterial(null, acceptingTrustStrategy).build();
            SSLConnectionSocketFactory connectionSocketFactory =
                    new SSLConnectionSocketFactory(sslContext, new NoopHostnameVerifier());

            HttpClientBuilder httpClientBuilder = HttpClients.custom();
            httpClientBuilder.setSSLSocketFactory(connectionSocketFactory);
            CloseableHttpClient httpClient = httpClientBuilder.build();
            HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
            factory.setHttpClient(httpClient);
            return factory;
        }
        catch (Exception e) {
            throw new RuntimeException("创建连接失败", e);
        }
    }

}
