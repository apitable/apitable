package com.vikadata.social.wecom;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import com.google.common.collect.Maps;
import me.chanjar.weixin.common.error.WxRuntimeException;
import me.chanjar.weixin.common.redis.WxRedisOps;
import me.chanjar.weixin.cp.api.WxCpAgentService;
import me.chanjar.weixin.cp.api.WxCpDepartmentService;
import me.chanjar.weixin.cp.api.WxCpMenuService;
import me.chanjar.weixin.cp.api.WxCpMessageService;
import me.chanjar.weixin.cp.api.WxCpOAuth2Service;
import me.chanjar.weixin.cp.api.WxCpService;
import me.chanjar.weixin.cp.api.WxCpUserService;
import me.chanjar.weixin.cp.config.WxCpTpConfigStorage;
import me.chanjar.weixin.cp.config.impl.WxCpTpRedissonConfigImpl;
import me.chanjar.weixin.cp.tp.message.WxCpTpMessageRouter;
import me.chanjar.weixin.cp.tp.message.WxCpTpMessageRouterRule;
import me.chanjar.weixin.cp.tp.service.WxCpTpService;
import me.chanjar.weixin.cp.tp.service.WxCpTpTagService;

import com.vikadata.social.wecom.WeComConfig.IsvApp;
import com.vikadata.social.wecom.WeComConfig.OperateEnpDdns;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;
import com.vikadata.social.wecom.constants.WeComIsvMsgType;
import com.vikadata.social.wecom.exception.WeComApiException;
import com.vikadata.social.wecom.exception.WeComExceptionConstants;
import com.vikadata.social.wecom.handler.WeComIsvMessageHandler;
import com.vikadata.social.wecom.model.ActionEnpApiResponse;
import com.vikadata.social.wecom.model.CheckEnpApiResponse;
import com.vikadata.social.wecom.model.CheckEnpApiResponse.Data;
import com.vikadata.social.wecom.model.EnpDdnsApiBaseResponse;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClientException;

/**
 * <p>
 * 企业微信操作Template
 * </p>
 *
 * @author Pengap
 * @date 2021/7/28 16:47:50
 */
public class WeComTemplate extends AbstractWeComTemplate implements ApplicationContextAware, InitializingBean {

    /*
     * 定义微信API的Service线程变量
     * 由于本地线程变量可能导致内存泄露问题加上代码无法抽象的知道调用#remove()的时机
     * 所有需要编写代码用户根据实际手动触发调用#closeService()
     */
    private final static ThreadLocal<WxCpService> THREAD_LOCAL = new ThreadLocal<>();

    private static final Map<String, WxCpTpService> ISV_SERVICES = Maps.newHashMapWithExpectedSize(1);
    private static final Map<String, WxCpTpTagService> ISV_TAG_SERVICES = Maps.newHashMapWithExpectedSize(1);
    private static final Map<String, WxCpTpMessageRouter> ISV_ROUTERS = Maps.newHashMapWithExpectedSize(16);

    private ApplicationContext applicationContext;

    /*
     * 构造方法需要指定，存储策略
     */
    public WeComTemplate(WeComConfig weComConfig) {
        this(weComConfig, null);
    }

    public WeComTemplate(WeComConfig weComConfig, WxRedisOps wxRedisOps) {
        super.weComConfig = weComConfig;

        generateIsvList(wxRedisOps, weComConfig.getIsvAppList());
    }

    /**
     * 创建第三方服务商配置
     *
     * @param isvAppList 第三方服务商配置信息列表
     * @author 刘斌华
     * @date 2022-01-05 10:20:41
     */
    private void generateIsvList(WxRedisOps wxRedisOps, List<IsvApp> isvAppList) {

        if (CollUtil.isNotEmpty(isvAppList)) {
            isvAppList.forEach(isvApp -> {
                WxCpTpService isvService = new WxCpIsvServiceImpl();
                WxCpTpRedissonConfigImpl configStorage = WxCpTpRedissonConfigImpl.builder()
                        .wxRedisOps(wxRedisOps)
                        .keyPrefix("vikadata:wecom:isv")
                        .corpId(isvApp.getCorpId())
                        .providerSecret(isvApp.getProviderSecret())
                        .suiteId(isvApp.getSuiteId())
                        .suiteSecret(isvApp.getSuiteSecret())
                        .token(isvApp.getToken())
                        .aesKey(isvApp.getAesKey())
                        .build();
                isvService.setWxCpTpConfigStorage(configStorage);
                ISV_SERVICES.put(isvApp.getSuiteId(), isvService);
                ISV_TAG_SERVICES.put(isvApp.getSuiteId(), new WxCpIsvTagServiceImpl(isvService));
            });
        }

    }

    /**
     * 切换到对应企业应用 Service
     * 无法使用临时授权服务
     *
     * @param corpId    企业Id
     * @param agentId   应用Id
     */
    public void switchoverTo(String corpId, Integer agentId) {
        this.switchoverTo(corpId, agentId, false);
    }

    /**
     * 切换到对应企业应用 Service
     * isTempAuthService=true 可以使用临时授权服务
     *
     * @param corpId                企业Id
     * @param agentId               应用Id
     * @param isTempAuthService     临时授权服务
     */
    public void switchoverTo(String corpId, Integer agentId, boolean isTempAuthService) {
        WxCpService service = null;
        String key = mergeKey(corpId, agentId);
        boolean isExistService = isExistService(key, isTempAuthService);
        if (isExistService && !isTempAuthService) {
            service = cpServices.get(key);
        }
        else if (isExistService) {
            service = cpServicesByTempAuth.get(key, false);
        }

        if (null == service) {
            throw new WxRuntimeException(String.format("无法找到对应【%s】的企业微信配置信息，请核实！", key));
        }
        THREAD_LOCAL.set(service);
    }

    @Override
    public WxCpService openService() {
        return Optional.of(THREAD_LOCAL.get()).orElseThrow(() -> new RuntimeException("企业微信Service加载失败"));
    }

    @Override
    public void closeService() {
        THREAD_LOCAL.remove();
    }

    public WxCpTpService isvService(String suiteId) {

        return ISV_SERVICES.get(suiteId);

    }

    public WxCpTpTagService isvTagService(String suiteId) {

        return ISV_TAG_SERVICES.get(suiteId);

    }

    public WxCpTpMessageRouter isvRouter(String suiteId) {

        return ISV_ROUTERS.get(suiteId);

    }

    public WxCpOAuth2Service oAuth2Service() {
        return openService().getOauth2Service();
    }

    public WxCpUserService userService() {
        return openService().getUserService();
    }

    public WxCpAgentService agentService() {
        return openService().getAgentService();
    }

    public WxCpMenuService menuService() {
        return openService().getMenuService();
    }

    public WxCpDepartmentService departmentService() {
        return openService().getDepartmentService();
    }

    public WxCpMessageService messageService() {
        return openService().getMessageService();
    }

    /**
     * 添加域名解析值 <br/>
     * <ul>
     *     <li>固定顶级域名：vika.(cn/ltd)</li>
     *     <li>如果创建二级域名 - domainName：second-level；结果：second-level.vika.cn</li>
     *     <li>如果创建三级域名 - domainName：asw1.enp；结果：asw1.enp.vika.cn</li>
     * </ul>
     *
     * @param domainPrefix 域前缀
     * @return 创建是否成功
     */
    public String addEnpDomainName(String domainPrefix) {
        try {
            ActionEnpApiResponse response = actionEnpDomainApi("add", domainPrefix, ActionEnpApiResponse.class);
            if (null == response) {
                throw new WeComApiException(WeComExceptionConstants.APPLY_ENP_DOMAIN_ERR_CODE, "申请企业域名响应错误");
            }
            ActionEnpApiResponse.Data data = response.getData();
            if (!response.getSuccess() || Objects.isNull(data) || StrUtil.isBlank(data.getDomainName())) {
                LOGGER.error("申请企业域名错误：{}", response.getError());
                throw new WeComApiException(WeComExceptionConstants.APPLY_ENP_DOMAIN_ERR_CODE, "申请企业域名失败");
            }
            return data.getDomainName();
        }
        catch (RestClientException e) {
            LOGGER.error("创建企业域名错误：", e);
            throw new WeComApiException("创建企业域名错误");
        }
    }

    /**
     * 删除域名解析值 <br/>
     * <p>
     *   domainName：second-level、asw1.enp
     * </p>
     *
     * @param domainPrefix 域前缀
     * @return 是否删除成功
     */
    public boolean removeEnpDomainName(String domainPrefix) {
        try {
            ActionEnpApiResponse response = actionEnpDomainApi("delete", domainPrefix, ActionEnpApiResponse.class);
            if (null == response) {
                throw new WeComApiException(WeComExceptionConstants.DELETE_ENP_DOMAIN_ERR_CODE, "撤销企业域名响应错误");
            }
            if (!response.getSuccess()) {
                LOGGER.error("撤销企业域名错误：{}", response.getError());
                throw new WeComApiException(WeComExceptionConstants.DELETE_ENP_DOMAIN_ERR_CODE, "撤销企业域名失败");
            }
            return true;
        }
        catch (RestClientException e) {
            LOGGER.error("删除企业域名错误：", e);
            throw new WeComApiException("删除企业域名错误");
        }
    }

    /**
     * 校验域名解析值 <br/>
     * <p>
     *   domainName：second-level、asw1.enp
     * </p>
     *
     * @param domainPrefix 域前缀
     * @return 是否存在
     */
    public Data checkEnpDomainName(String domainPrefix) {
        try {
            CheckEnpApiResponse response = actionEnpDomainApi("check", domainPrefix, CheckEnpApiResponse.class);
            if (null == response) {
                throw new WeComApiException(WeComExceptionConstants.CHECK_ENP_DOMAIN_ERR_CODE, "校验企业域名响应错误");
            }
            CheckEnpApiResponse.Data data = response.getData();
            if (!response.getSuccess()) {
                LOGGER.error("校验企业域名错误：{}", response.getError());
                throw new WeComApiException(WeComExceptionConstants.CHECK_ENP_DOMAIN_ERR_CODE, "校验企业域名失败");
            }
            if (Objects.nonNull(data) && StrUtil.isNotBlank(data.getIpList())) {
                return data;
            }
            return null;
        }
        catch (RestClientException e) {
            LOGGER.error("校验企业域名错误：", e);
            throw new WeComApiException("校验企业域名错误");
        }
    }

    /**
     * 调用api操作新增、删除等域名解析动作
     * <p>
     *     actionOp支持参数：「add、delete、check」
     * </p>
     *
     * @param actionOp     请求动作
     * @param domainPrefix 域前缀
     * @return 请求结果
     * @throws RestClientException
     */
    private <T extends EnpDdnsApiBaseResponse> T actionEnpDomainApi(String actionOp, String domainPrefix, Class<T> responseType) throws RestClientException {
        OperateEnpDdns autoCreateDdns = super.getConfig().getOperateEnpDdns();
        String url = autoCreateDdns.getApiHost() + autoCreateDdns.getActionDdnsUrl();

        HttpHeaders header = new HttpHeaders();
        // post 请求 需要设置contentType
        header.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> requestBody = new HashMap<>(2);
        requestBody.put("action", actionOp);
        requestBody.put("name", domainPrefix);

        HttpEntity<Object> entity = new HttpEntity<>(requestBody, header);
        return getRestTemplate().postForObject(url, entity, responseType);
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    @Override
    public void afterPropertiesSet() {

        List<WeComIsvMessageHandler> isvHandlers = Optional
                .of(applicationContext.getBeansOfType(WeComIsvMessageHandler.class))
                .filter(map -> !map.isEmpty())
                .map(map -> new ArrayList<>(map.values()))
                .orElse(null);
        if (CollUtil.isNotEmpty(isvHandlers)) {
            ISV_SERVICES.values().forEach(isvService -> {
                WxCpTpMessageRouter isvRouter = new WxCpTpMessageRouter(isvService);
                // 先将所有处理器排序
                isvHandlers.sort(Comparator.comparingInt(WeComIsvMessageHandler::order));
                // 填充路由处理器
                isvHandlers.forEach(isvHandler -> {
                    WeComIsvMsgType msgType = isvHandler.msgType();
                    WeComIsvMessageType messageType = isvHandler.messageType();
                    WxCpTpMessageRouterRule routerRule = isvRouter.rule()
                            .async(isvHandler.async())
                            .msgType(msgType == WeComIsvMsgType.EVENT ? "event" :
                                    msgType == WeComIsvMsgType.INFO_TYPE ? null : messageType.getInfoType())
                            .event(msgType == WeComIsvMsgType.EVENT ? messageType.getInfoType() : null)
                            .infoType(msgType == WeComIsvMsgType.INFO_TYPE ? messageType.getInfoType() : null)
                            .handler(isvHandler);
                    if (isvHandler.next()) {
                        routerRule.next();
                    } else {
                        routerRule.end();
                    }
                });

                @SuppressWarnings("deprecation") // 必须要使用该方法获取应用套件 ID
                WxCpTpConfigStorage wxCpTpConfigStorage = isvService.getWxCpTpConfigStorage();
                ISV_ROUTERS.put(wxCpTpConfigStorage.getSuiteId(), isvRouter);
            });
        }

    }

}
