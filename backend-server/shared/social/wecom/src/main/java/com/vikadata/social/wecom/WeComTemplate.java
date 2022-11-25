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

public class WeComTemplate extends AbstractWeComTemplate implements ApplicationContextAware, InitializingBean {

    /*
     * Define the Service thread variable of the WeCom API
     * Due to the possibility of memory leaks due to local thread variables and the code cannot abstractly know when to call remove()
     * All users need to call close Service() according to the actual manual trigger
     */
    private final static ThreadLocal<WxCpService> THREAD_LOCAL = new ThreadLocal<>();

    private static final Map<String, WxCpTpService> ISV_SERVICES = Maps.newHashMapWithExpectedSize(1);

    private static final Map<String, WxCpTpTagService> ISV_TAG_SERVICES = Maps.newHashMapWithExpectedSize(1);

    private static final Map<String, WxCpTpMessageRouter> ISV_ROUTERS = Maps.newHashMapWithExpectedSize(16);

    private ApplicationContext applicationContext;

    /*
     * The construction method needs to be specified, the storage strategy
     */
    public WeComTemplate(WeComConfig weComConfig) {
        this(weComConfig, null);
    }

    public WeComTemplate(WeComConfig weComConfig, WxRedisOps wxRedisOps) {
        super.weComConfig = weComConfig;

        generateIsvList(wxRedisOps, weComConfig.getIsvAppList());
    }

    /**
     * Create isv app onfiguration
     * @param isvAppList isv app configuration information list
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
     * Switch to the corresponding enterprise application service
     * Unable to use temporary authorization service
     * @param corpId    corp id
     * @param agentId   application id
     */
    public void switchoverTo(String corpId, Integer agentId) {
        this.switchoverTo(corpId, agentId, false);
    }

    /**
     * Switch to the corresponding enterprise application service Service
     * isTempAuthService=true temporary authorization service available
     *
     * @param corpId                corp Id
     * @param agentId               agent Id
     * @param isTempAuthService     temporary authorization service
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
            throw new WxRuntimeException(String.format("cannot find wecom app config[%s]", key));
        }
        THREAD_LOCAL.set(service);
    }

    @Override
    public WxCpService openService() {
        return Optional.of(THREAD_LOCAL.get()).orElseThrow(() -> new RuntimeException("get wecom service fail"));
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
     * Add domain resolution value <br/>
     * <ul>
     *     <li>fixed top-level domain：vika.(cn/ltd)</li>
     *     <li>If you create a second-level domain - domainName：second-level；result：second-level.vika.cn</li>
     *     <li>If you create a third-level domain - domainName：asw1.enp；result：asw1.enp.vika.cn</li>
     * </ul>
     *
     * @param domainPrefix domain prefix
     * @return Whether the creation was successful
     */
    public String addEnpDomainName(String domainPrefix) {
        try {
            ActionEnpApiResponse response = actionEnpDomainApi("add", domainPrefix, ActionEnpApiResponse.class);
            if (null == response) {
                throw new WeComApiException(WeComExceptionConstants.APPLY_ENP_DOMAIN_ERR_CODE, "apply domain response error");
            }
            ActionEnpApiResponse.Data data = response.getData();
            if (!response.getSuccess() || Objects.isNull(data) || StrUtil.isBlank(data.getDomainName())) {
                LOGGER.error("failed to apply domain: {}", response.getError());
                throw new WeComApiException(WeComExceptionConstants.APPLY_ENP_DOMAIN_ERR_CODE, "failed to apply domain");
            }
            return data.getDomainName();
        }
        catch (RestClientException e) {
            LOGGER.error("create business domain error：", e);
            throw new WeComApiException("create business domain error");
        }
    }

    /**
     * Delete the domain name resolution value <br/>
     * <p>
     *   domainName：second-level、asw1.enp
     * </p>
     *
     * @param domainPrefix domain prefix
     * @return Whether the deletion is successful
     */
    public boolean removeEnpDomainName(String domainPrefix) {
        try {
            ActionEnpApiResponse response = actionEnpDomainApi("delete", domainPrefix, ActionEnpApiResponse.class);
            if (null == response) {
                throw new WeComApiException(WeComExceptionConstants.DELETE_ENP_DOMAIN_ERR_CODE, "revocation of domain response error");
            }
            if (!response.getSuccess()) {
                LOGGER.error("revocation of domain error: {}", response.getError());
                throw new WeComApiException(WeComExceptionConstants.DELETE_ENP_DOMAIN_ERR_CODE, "revocation of domain error");
            }
            return true;
        }
        catch (RestClientException e) {
            LOGGER.error("delete domain error: ", e);
            throw new WeComApiException("delete domain error");
        }
    }

    /**
     * Verify the domain resolution value <br/>
     * <p>
     *   domainName：second-level、asw1.enp
     * </p>
     *
     * @param domainPrefix domain prefix
     * @return does it exist
     */
    public Data checkEnpDomainName(String domainPrefix) {
        try {
            CheckEnpApiResponse response = actionEnpDomainApi("check", domainPrefix, CheckEnpApiResponse.class);
            if (null == response) {
                throw new WeComApiException(WeComExceptionConstants.CHECK_ENP_DOMAIN_ERR_CODE, "check domain response error");
            }
            Data data = response.getData();
            if (!response.getSuccess()) {
                LOGGER.error("check domain error: {}", response.getError());
                throw new WeComApiException(WeComExceptionConstants.CHECK_ENP_DOMAIN_ERR_CODE, "check domain error");
            }
            if (Objects.nonNull(data) && StrUtil.isNotBlank(data.getIpList())) {
                return data;
            }
            return null;
        }
        catch (RestClientException e) {
            LOGGER.error("check domain error: ", e);
            throw new WeComApiException("check domain error");
        }
    }

    /**
     * Call api operations to add, delete and other domain resolution actions
     * <p>
     *     actionOp support parameters: add/delete/check
     * </p>
     *
     * @param actionOp     request action
     * @param domainPrefix domain prefix
     * @return request result
     * @throws RestClientException
     */
    private <T extends EnpDdnsApiBaseResponse> T actionEnpDomainApi(String actionOp, String domainPrefix, Class<T> responseType) throws RestClientException {
        OperateEnpDdns autoCreateDdns = super.getConfig().getOperateEnpDdns();
        String url = autoCreateDdns.getApiHost() + autoCreateDdns.getActionDdnsUrl();

        HttpHeaders header = new HttpHeaders();
        // The post request needs to set the contentType
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
                // Sort all processors first
                isvHandlers.sort(Comparator.comparingInt(WeComIsvMessageHandler::order));
                // Populate the route handler
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
                    }
                    else {
                        routerRule.end();
                    }
                });

                @SuppressWarnings("deprecation") // This method must be used to get the application suite ID
                WxCpTpConfigStorage wxCpTpConfigStorage = isvService.getWxCpTpConfigStorage();
                ISV_ROUTERS.put(wxCpTpConfigStorage.getSuiteId(), isvRouter);
            });
        }

    }

}
