package com.vikadata.boot.autoconfigure.wx.mp;

import me.chanjar.weixin.common.redis.RedisTemplateWxRedisOps;
import me.chanjar.weixin.common.redis.WxRedisOps;
import me.chanjar.weixin.mp.api.WxMpService;
import me.chanjar.weixin.mp.api.impl.WxMpServiceHttpClientImpl;
import me.chanjar.weixin.mp.api.impl.WxMpServiceImpl;
import me.chanjar.weixin.mp.api.impl.WxMpServiceJoddHttpImpl;
import me.chanjar.weixin.mp.api.impl.WxMpServiceOkHttpImpl;
import me.chanjar.weixin.mp.config.WxMpConfigStorage;
import me.chanjar.weixin.mp.config.WxMpHostConfig;
import me.chanjar.weixin.mp.config.impl.WxMpDefaultConfigImpl;
import me.chanjar.weixin.mp.config.impl.WxMpRedisConfigImpl;
import org.apache.commons.lang3.StringUtils;

import com.vikadata.boot.autoconfigure.wx.mp.WxMpProperties.HttpClientType;

import org.springframework.beans.BeansException;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.StringRedisTemplate;

/**
 *
 * @author Shawn Deng
 * @date 2021-06-21 20:44:12
 */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(WxMpProperties.class)
@ConditionalOnClass(WxMpService.class)
@ConditionalOnProperty(value = "vikadata-starter.wx.mp.enabled", havingValue = "true")
public class WxMpAutoConfiguration {

    private final WxMpProperties wxMpProperties;

    public WxMpAutoConfiguration(WxMpProperties wxMpProperties) {
        this.wxMpProperties = wxMpProperties;
    }

    @Configuration(proxyBeanMethods = false)
    protected static class StorageAutoConfiguration implements ApplicationContextAware {

        private final WxMpProperties wxMpProperties;

        private ApplicationContext applicationContext;

        public StorageAutoConfiguration(WxMpProperties wxMpProperties) {
            this.wxMpProperties = wxMpProperties;
        }

        @Bean
        @ConditionalOnProperty(value = "vikadata-starter.wx.mp.config-storage.storage-type", havingValue = "memory")
        public WxMpConfigStorage wxMpInMemoryStorageConfig() {
            return config(new WxMpDefaultConfigImpl(), wxMpProperties);
        }

        @Bean
        @ConditionalOnProperty(value = "vikadata-starter.wx.mp.config-storage.storage-type", havingValue = "redistemplate")
        public WxMpConfigStorage wxMpInRedisTemplateStorageConfig() {
            StringRedisTemplate redisTemplate = applicationContext.getBean(StringRedisTemplate.class);
            WxRedisOps redisOps = new RedisTemplateWxRedisOps(redisTemplate);
            return config(new WxMpRedisConfigImpl(redisOps, wxMpProperties.getConfigStorage().getKeyPrefix()), wxMpProperties);
        }

        private static WxMpDefaultConfigImpl config(WxMpDefaultConfigImpl config, WxMpProperties properties) {
            WxMpProperties.ConfigStorage configStorageProperties = properties.getConfigStorage();
            config.setAppId(properties.getAppId());
            config.setSecret(properties.getSecret());
            config.setToken(properties.getToken());
            config.setAesKey(properties.getAesKey());

            config.setHttpProxyHost(configStorageProperties.getHttpProxyHost());
            config.setHttpProxyUsername(configStorageProperties.getHttpProxyUsername());
            config.setHttpProxyPassword(configStorageProperties.getHttpProxyPassword());
            if (configStorageProperties.getHttpProxyPort() != null) {
                config.setHttpProxyPort(configStorageProperties.getHttpProxyPort());
            }

            if (null != properties.getHost() && StringUtils.isNotEmpty(properties.getHost().getApiHost())) {
                WxMpHostConfig hostConfig = new WxMpHostConfig();
                hostConfig.setApiHost(properties.getHost().getApiHost());
                hostConfig.setMpHost(properties.getHost().getMpHost());
                hostConfig.setOpenHost(properties.getHost().getOpenHost());
                config.setHostConfig(hostConfig);
            }
            return config;
        }

        @Override
        public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
            this.applicationContext = applicationContext;
        }
    }

    @Bean
    @ConditionalOnMissingBean
    public WxMpService wxMpService(WxMpConfigStorage configStorage) {
        HttpClientType httpClientType = wxMpProperties.getConfigStorage().getHttpClientType();
        WxMpService wxMpService;
        switch (httpClientType) {
            case OkHttp:
                wxMpService = new WxMpServiceOkHttpImpl();
                break;
            case JoddHttp:
                wxMpService = new WxMpServiceJoddHttpImpl();
                break;
            case HttpClient:
                wxMpService = new WxMpServiceHttpClientImpl();
                break;
            default:
                wxMpService = new WxMpServiceImpl();
                break;
        }
        wxMpService.setWxMpConfigStorage(configStorage);
        return wxMpService;
    }
}
