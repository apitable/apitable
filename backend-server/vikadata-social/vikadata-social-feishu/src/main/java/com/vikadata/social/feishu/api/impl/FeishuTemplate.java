package com.vikadata.social.feishu.api.impl;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;

import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.http.HttpException;
import cn.hutool.http.HttpResponse;
import cn.hutool.http.HttpUtil;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.social.core.ApiBinding;
import com.vikadata.social.core.AppTicketStorage;
import com.vikadata.social.core.URIUtil;
import com.vikadata.social.feishu.FeishuConfigStorageHolder;
import com.vikadata.social.feishu.FeishuResponseErrorHandler;
import com.vikadata.social.feishu.Jackson4FeishuConverter;
import com.vikadata.social.feishu.api.AppOperations;
import com.vikadata.social.feishu.api.AuthOperations;
import com.vikadata.social.feishu.api.BotOperations;
import com.vikadata.social.feishu.api.ContactOperations;
import com.vikadata.social.feishu.api.DepartmentOperations;
import com.vikadata.social.feishu.api.Feishu;
import com.vikadata.social.feishu.api.ImageOperations;
import com.vikadata.social.feishu.api.MessageOperations;
import com.vikadata.social.feishu.api.TenantOperations;
import com.vikadata.social.feishu.api.UserOperations;
import com.vikadata.social.feishu.config.FeishuConfigStorage;
import com.vikadata.social.feishu.exception.FeishuApiException;
import com.vikadata.social.feishu.model.BaseResponse;
import com.vikadata.social.feishu.model.FeishuAccessToken;
import com.vikadata.social.feishu.model.FeishuAccessTokenRequest;
import com.vikadata.social.feishu.model.FeishuAccessTokenResponse;
import com.vikadata.social.feishu.model.FeishuAppAccessTokenInternalRequest;
import com.vikadata.social.feishu.model.FeishuAppAccessTokenInternalResponse;
import com.vikadata.social.feishu.model.FeishuAppAccessTokenIsvRequest;
import com.vikadata.social.feishu.model.FeishuAppAccessTokenIsvResponse;
import com.vikadata.social.feishu.model.FeishuPassportAccessToken;
import com.vikadata.social.feishu.model.FeishuPassportUserInfo;
import com.vikadata.social.feishu.model.FeishuResendAppTicketRequest;
import com.vikadata.social.feishu.model.FeishuResendAppTicketResponse;
import com.vikadata.social.feishu.model.FeishuTenantAccessTokenInternalRequest;
import com.vikadata.social.feishu.model.FeishuTenantAccessTokenInternalResponse;
import com.vikadata.social.feishu.model.FeishuTenantAccessTokenIsvRequest;
import com.vikadata.social.feishu.model.FeishuTenantAccessTokenIsvResponse;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.BufferingClientHttpRequestFactory;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;

import static com.vikadata.social.feishu.FeishuBase.API_URL_BASE;
import static com.vikadata.social.feishu.exception.FeishuExceptionConstants.TENANT_ACCESS_TOKEN_INVALID;

/**
 * 飞书
 * 主动调用HTTP请求的服务类
 *
 * @author Shawn Deng
 * @date 2020-11-18 15:30:02
 */
public class FeishuTemplate extends ApiBinding implements Feishu {

    private static final Logger LOGGER = LoggerFactory.getLogger(FeishuTemplate.class);

    private static final String OAUTH2_URL = "/authen/v1/index";

    private static final String PASSPORT_ACCESS_TOKEN_URL = "https://passport.feishu.cn/suite/passport/oauth/token";

    private static final String PASSPORT_USER_INFO_URL = "https://passport.feishu.cn/suite/passport/oauth/userinfo";

    private static final String ACCESS_TOKEN_URL = "/authen/v1/access_token";

    private static final String RESEND_APP_TICKET = "/auth/v3/app_ticket/resend";

    private static final String GET_APP_ACCESS_TOKEN_INTERNAL = "/auth/v3/app_access_token/internal";

    private static final String GET_APP_ACCESS_TOKEN_ISV = "/auth/v3/app_access_token";

    private static final String GET_TENANT_ACCESS_TOKEN_INTERNAL = "/auth/v3/tenant_access_token/internal";

    private static final String GET_TENANT_ACCESS_TOKEN_ISV = "/auth/v3/tenant_access_token";

    private final AuthOperations authOperations = new AuthTemplate(this);

    private final AppOperations appOperations = new AppTemplate(this);

    private final ContactOperations contactOperations = new ContactTemplate(this);

    private final UserOperations userOperations = new UserTemplate(this);

    private final DepartmentOperations departmentOperations = new DepartmentTemplate(this);

    private final BotOperations botOperations = new BotTemplate(this);

    private final MessageOperations messageOperations = new MessageTemplate(this);

    private final TenantOperations tenantOperations = new TenantTemplate(this);

    private final ImageOperations imageOperations = new ImageTemplate(this);

    private AppTicketStorage ticketStorage;

    private FeishuConfigStorage defaultConfigStorage;

    /**
     * 存储应用配置器，存储太多会不会不好？
     */
    private Map<String, FeishuConfigStorage> configStorageMap;

    public FeishuTemplate() {
        // 配置RestTemplate
        configureRestTemplate();
    }

    public void setTicketStorage(AppTicketStorage ticketStorage) {
        this.ticketStorage = ticketStorage;
    }

    /**
     * 调用构造实例，添加默认存储器
     */
    public void prepareTicketConfig() {
        // 如果一开始就有商店应用，那么必须要配置商店应用票据存储器
        if (this.ticketStorage == null) {
            throw new IllegalStateException("独立服务商应用需提供Ticket存储器的实现，请实现AppTicketStorage接口，并注入到FeishuTemplate");
        }
        // 启动时主动触发重新发送ticket
        LOGGER.info("当前应用[{}]是独立服务商，主动触发重新发送ticket", defaultConfigStorage.getAppId());
        resendAppTicket(defaultConfigStorage.getAppId(), defaultConfigStorage.getAppSecret());
    }

    public String buildAuthorizationUrl(String redirectUri, String state) {
        Map<String, Object> queryMap = new HashMap<>(3);
        queryMap.put("app_id", getConfigStorage().getAppId());
        queryMap.put("redirect_uri", redirectUri);
        queryMap.put("state", StrUtil.trimToEmpty(state));
        return HttpUtil.urlWithForm(buildUri(OAUTH2_URL), queryMap, StandardCharsets.UTF_8, false);
    }

    public FeishuAccessToken getUserAccessToken(String code) throws FeishuApiException {
        FeishuAccessTokenRequest request = new FeishuAccessTokenRequest();
        request.setAppAccessToken(getAppAccessToken(false));
        request.setCode(code);
        request.setGrantType("authorization_code");
        FeishuAccessTokenResponse response = this.doPost(buildUri(ACCESS_TOKEN_URL), MapUtil.newHashMap(), request, FeishuAccessTokenResponse.class);
        FeishuAccessToken accessToken = response.getData();
        getConfigStorage().updateUserAccessToken(accessToken.getAccessToken(), accessToken.getRefreshToken(), accessToken.getExpiresIn());
        return accessToken;
    }

    public FeishuPassportAccessToken getPassportAccessToken(String code, String redirectUri) {
        FeishuConfigStorage configStorage = getConfigStorage();
        HttpResponse response = HttpUtil.createPost(PASSPORT_ACCESS_TOKEN_URL)
                .form("grant_type", "authorization_code")
                .form("client_id", configStorage.getAppId())
                .form("client_secret", configStorage.getAppSecret())
                .form("code", code)
                .form("redirect_uri", URIUtil.encodeURIComponent(redirectUri))
                .execute();
        if (!response.isOk()) {
            throw new HttpException("获取访问令牌响应失败: " + response.body());
        }
        try {
            return Jackson4FeishuConverter.toObject(response.body(), new TypeReference<FeishuPassportAccessToken>() {});
        }
        catch (IOException e) {
            throw new HttpException("解析飞书响应体失败: " + response.body(), e);
        }
    }

    public FeishuPassportUserInfo getPassportUserInfo(String accessToken) {
        HttpResponse response = HttpUtil.createGet(PASSPORT_USER_INFO_URL)
                .bearerAuth(accessToken)
                .execute();
        if (!response.isOk()) {
            throw new HttpException("获取用户身份信息响应失败: " + response.body());
        }
        try {
            return Jackson4FeishuConverter.toObject(response.body(), new TypeReference<FeishuPassportUserInfo>() {});
        }
        catch (IOException e) {
            throw new HttpException("解析飞书响应体失败:" + response.body(), e);
        }
    }

    public void setDefaultConfigStorage(FeishuConfigStorage configStorage) {
        this.defaultConfigStorage = configStorage;
        addConfigStorage(configStorage);
    }

    public FeishuConfigStorage getDefaultConfigStorage() {
        return defaultConfigStorage;
    }

    public boolean isDefaultIsv() {
        return defaultConfigStorage.isv();
    }

    public void addConfigStorage(FeishuConfigStorage configStorage) {
        LOGGER.info("添加新的配置");
        if (this.configStorageMap == null) {
            this.configStorageMap = MapUtil.newConcurrentHashMap();
            this.configStorageMap.put(configStorage.getAppId(), configStorage);
        }
        else {
            this.configStorageMap.put(configStorage.getAppId(), configStorage);
        }
    }

    public FeishuConfigStorage getConfigStorage() {
        if (this.configStorageMap == null) {
            LOGGER.error("当前应用配置存储器为空，无法获取应用配置");
            return null;
        }

        // 获取当前上下文存储的时候，如果有多个应用配置，必须调用switchTo方法切换上下文
        if (StrUtil.isBlank(FeishuConfigStorageHolder.get())) {
            // 当前上下文应用标识变量没有设置，返回空
            LOGGER.error("当前没有应用上下文，无法获取应用配置");
            return null;
        }
        return this.configStorageMap.get(FeishuConfigStorageHolder.get());
    }

    public void removeConfigStorage(String appId) {
        synchronized (this) {
            if (this.configStorageMap.size() == 1) {
                this.configStorageMap.remove(appId);
                LOGGER.warn("已删除最后一个配置：{}，须立即使用setWxMpConfigStorage或setMultiConfigStorages添加配置", appId);
                return;
            }
            if (FeishuConfigStorageHolder.get().equals(appId)) {
                this.configStorageMap.remove(appId);
                final String defaultAppId = this.configStorageMap.keySet().iterator().next();
                LOGGER.warn("已删除默认配置，【{}】被设为默认配置", defaultAppId);
                return;
            }
            this.configStorageMap.remove(appId);
        }
    }

    /**
     * 切换默认应用配置上下文
     */
    public synchronized void switchDefault() {
        if (this.configStorageMap == null) {
            LOGGER.error("配置存储器为空，无法切换默认应用上下文！");
            return;
        }
        if (this.configStorageMap.containsKey(defaultConfigStorage.getAppId())) {
            FeishuConfigStorageHolder.set(defaultConfigStorage.getAppId());
            return;
        }
        this.configStorageMap.put(defaultConfigStorage.getAppId(), defaultConfigStorage);
        FeishuConfigStorageHolder.set(defaultConfigStorage.getAppId());
    }

    /**
     * 切换应用配置上下文
     * @param configStorage 存储
     */
    public synchronized void switchTo(FeishuConfigStorage configStorage) {
        if (this.configStorageMap == null) {
            // 从未使用过
            this.configStorageMap = MapUtil.newConcurrentHashMap();
            this.configStorageMap.put(configStorage.getAppId(), configStorage);
            return;
        }
        this.configStorageMap.put(configStorage.getAppId(), configStorage);
        FeishuConfigStorageHolder.set(configStorage.getAppId());
    }

    public void cleanContext() {
        FeishuConfigStorageHolder.remove();
    }

    public String getAppAccessToken(boolean forceRefresh) {
        if (!getConfigStorage().isAppAccessTokenExpired() && !forceRefresh) {
            return getConfigStorage().getAppAccessToken();
        }
        Lock lock = getConfigStorage().getAppAccessTokenLock();
        boolean locked = false;
        try {
            do {
                locked = lock.tryLock(100, TimeUnit.MILLISECONDS);
                if (!getConfigStorage().isAppAccessTokenExpired() && !forceRefresh) {
                    return getConfigStorage().getAppAccessToken();
                }
            } while (!locked);
            if (getConfigStorage().isv()) {
                // 企业商店应用
                if (ticketStorage == null) {
                    throw new IllegalStateException("未提供Ticket Storage的实现");
                }
                String appTicket = ticketStorage.getTicket();
                if (appTicket == null) {
                    throw new IllegalStateException("APP Ticket 未找到，也许未收到，等一会再获取");
                }
                FeishuAppAccessTokenIsvRequest request = new FeishuAppAccessTokenIsvRequest();
                request.setAppId(getConfigStorage().getAppId());
                request.setAppSecret(getConfigStorage().getAppSecret());
                request.setAppTicket(appTicket);
                FeishuAppAccessTokenIsvResponse response = this.doPost(buildUri(GET_APP_ACCESS_TOKEN_ISV), MapUtil.newHashMap(), request, FeishuAppAccessTokenIsvResponse.class);
                getConfigStorage().updateAppAccessToken(response.getAppAccessToken(), response.getExpire());
                return response.getAppAccessToken();
            }
            else {
                // 企业自建应用
                FeishuAppAccessTokenInternalRequest request = new FeishuAppAccessTokenInternalRequest();
                request.setAppId(getConfigStorage().getAppId());
                request.setAppSecret(getConfigStorage().getAppSecret());
                FeishuAppAccessTokenInternalResponse response = this.doPost(buildUri(GET_APP_ACCESS_TOKEN_INTERNAL), MapUtil.newHashMap(), request, FeishuAppAccessTokenInternalResponse.class);
                getConfigStorage().updateAppAccessToken(response.getAppAccessToken(), response.getExpire());
                return response.getAppAccessToken();
            }
        }
        catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        catch (FeishuApiException e) {
            throw new IllegalStateException(e);
        }
        finally {
            if (locked) {
                lock.unlock();
            }
        }
    }

    public String getTenantAccessToken(String tenantKey, boolean forceRefresh) throws FeishuApiException {
        if (!getConfigStorage().isTenantAccessTokenExpired(tenantKey) && !forceRefresh) {
            return getConfigStorage().getTenantAccessToken(tenantKey);
        }
        Lock lock = getConfigStorage().getTenantAccessTokenLock(tenantKey);
        boolean locked = false;
        try {
            do {
                locked = lock.tryLock(100, TimeUnit.MILLISECONDS);
                if (!getConfigStorage().isTenantAccessTokenExpired(tenantKey) && !forceRefresh) {
                    return getConfigStorage().getTenantAccessToken(tenantKey);
                }
            } while (!locked);
            if (getConfigStorage().isv()) {
                // 企业商店应用
                if (ticketStorage == null) {
                    throw new IllegalStateException("未提供Ticket Storage 的实现");
                }
                String appTicket = ticketStorage.getTicket();
                if (appTicket == null) {
                    throw new IllegalStateException("APP Ticket 未找到，也许未收到，等一会再获取");
                }
                FeishuTenantAccessTokenIsvRequest request = new FeishuTenantAccessTokenIsvRequest();
                request.setAppAccessToken(getAppAccessToken(false));
                request.setTenantKey(tenantKey);
                FeishuTenantAccessTokenIsvResponse response = this.doPost(buildUri(GET_TENANT_ACCESS_TOKEN_ISV), MapUtil.newHashMap(), request, FeishuTenantAccessTokenIsvResponse.class);
                getConfigStorage().updateTenantAccessToken(tenantKey, response.getTenantAccessToken(), response.getExpire());
                return response.getTenantAccessToken();
            }
            else {
                // 企业自建应用
                FeishuTenantAccessTokenInternalRequest request = new FeishuTenantAccessTokenInternalRequest();
                request.setAppId(getConfigStorage().getAppId());
                request.setAppSecret(getConfigStorage().getAppSecret());
                FeishuTenantAccessTokenInternalResponse response = this.doPost(buildUri(GET_TENANT_ACCESS_TOKEN_INTERNAL), MapUtil.newHashMap(), request, FeishuTenantAccessTokenInternalResponse.class);
                getConfigStorage().updateTenantAccessToken(tenantKey, response.getTenantAccessToken(), response.getExpire());
                return response.getTenantAccessToken();
            }
        }
        catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        finally {
            if (locked) {
                lock.unlock();
            }
        }
    }

    public <T extends BaseResponse> T doGet(String url, Map<String, String> headers, Class<T> responseClass) throws FeishuApiException {
        try {
            HttpHeaders header = null;
            if (headers != null && !headers.isEmpty()) {
                header = new HttpHeaders();
                headers.forEach(header::add);
            }
            HttpEntity<Void> request = new HttpEntity<>(header);
            LOGGER.info("Send Remote Get Request, Url : {}", url);
            ResponseEntity<T> response = getRestTemplate().exchange(url, HttpMethod.GET, request, responseClass);
            return handleResponse(response);
        }
        catch (RestClientException e) {
            throw new FeishuApiException(e.getMessage());
        }
    }

    public <T> T simpleGet(String url, HttpHeaders headers, Class<T> responseClass) {
        try {
            HttpEntity<Void> request = new HttpEntity<>(headers);
            LOGGER.info("Send Remote Get Request, Url : {}", url);
            ResponseEntity<T> response = getRestTemplate().exchange(url, HttpMethod.GET, request, responseClass);
            return response.getBody();
        }
        catch (RestClientException e) {
            throw new FeishuApiException(e.getMessage());
        }
    }

    public <T extends BaseResponse> T doPost(String url, Map<String, String> headers, Object requestBody, Class<T> responseClass) throws FeishuApiException {
        try {
            HttpHeaders header = null;
            if (headers != null && !headers.isEmpty()) {
                header = new HttpHeaders();
                headers.forEach(header::add);
            }
            HttpEntity<Object> entity = new HttpEntity<>(requestBody, header);
            LOGGER.info("Send Remote Post Request, Url : {}", url);
            ResponseEntity<T> response = getRestTemplate().postForEntity(url, entity, responseClass);
            return handleResponse(response);
        }
        catch (RestClientException e) {
            throw new FeishuApiException(e.getMessage());
        }
    }

    public <T> T postForm(String url, Map<String, String> formData, Class<T> responseClass) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
            formData.forEach(map::add);
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);
            LOGGER.info("Send Remote Post Form Request, Url : {}", url);
            ResponseEntity<T> response = getRestTemplate().postForEntity(url, request, responseClass);
            return response.getBody();
        }
        catch (RestClientException e) {
            throw new FeishuApiException(e.getMessage());
        }
    }

    private <T extends BaseResponse> T handleResponse(ResponseEntity<T> responseEntity) throws FeishuApiException {
        if (responseEntity == null) {
            throw new FeishuApiException("response message can not be null");
        }
        if (!responseEntity.getStatusCode().is2xxSuccessful()) {
            if (responseEntity.getBody() != null) {
                throw new FeishuApiException(responseEntity.getBody().getCode(), responseEntity.getBody().getMsg());
            }
            else {
                throw new FeishuApiException("请求飞书服务器失败，请检查网络或者参数");
            }
        }

        if (responseEntity.getBody() != null) {
            if (responseEntity.getBody().getCode() != 0) {
                throw new FeishuApiException(responseEntity.getBody().getCode(), responseEntity.getBody().getMsg());
            }
        }
        return responseEntity.getBody();
    }

    protected <T> T retryIfInvalidTenantAccessToken(ClientCallable<T> callable, String tenantKey) throws FeishuApiException {
        try {
            return callable.doExecute();
        }
        catch (FeishuApiException e) {
            if (e.getCode() == TENANT_ACCESS_TOKEN_INVALID) {
                this.getTenantAccessToken(tenantKey, true);
                return callable.doExecute();
            }
            throw e;
        }
    }

    protected interface ClientCallable<T> {

        /**
         * do whatever you want
         *
         * @return T
         * @throws FeishuApiException 飞书异常
         */
        T doExecute() throws FeishuApiException;
    }

    protected String buildUri(String resourceUrl) {
        return StrUtil.concat(false, API_URL_BASE, resourceUrl);
    }

    private void configureRestTemplate() {
        super.setRequestFactory(bufferRequestWrapper(getRestTemplate().getRequestFactory()));
        // 设置请求拦截器
        getRestTemplate().getInterceptors().add(userAgentInterceptor());
        // 响应结果错误自定义拦截
        getRestTemplate().setErrorHandler(new FeishuResponseErrorHandler());
    }

    private ClientHttpRequestInterceptor userAgentInterceptor() {
        return (request, bytes, execution) -> {
            request.getHeaders().set(HttpHeaders.USER_AGENT, "VikaData");
            return execution.execute(request, bytes);
        };
    }

    @Override
    public void setRequestFactory(ClientHttpRequestFactory requestFactory) {
        // 可自定义工厂类
        super.setRequestFactory(bufferRequestWrapper(requestFactory));
    }

    @Override
    protected MappingJackson2HttpMessageConverter getJsonMessageConverter() {
        // 配置消息转换器
        MappingJackson2HttpMessageConverter converter = super.getJsonMessageConverter();
        // 飞书的所有API请求参数都是下划线格式,而响应结构的属性也是下划线
        converter.getObjectMapper().setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
        converter.getObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return converter;
    }

    /**
     * 抽象基类已经设置默认的请求客户端工厂，再次包装请求，响应体流可重复读取
     *
     * @param requestFactory Request factory
     * @return ClientHttpRequestFactory
     */
    private static ClientHttpRequestFactory bufferRequestWrapper(ClientHttpRequestFactory requestFactory) {
        return new BufferingClientHttpRequestFactory(requestFactory);
    }

    /**
     * 在两种情况下需要触发
     * 1. 启动工程时候，初始化ISV商店应用实例，那么就需要第一时间触发
     * 2. 商店应用实例在事件url校验时候，可以触发验证，
     */
    public void resendAppTicket(String appId, String appSecret) {
        FeishuResendAppTicketRequest request = new FeishuResendAppTicketRequest();
        request.setAppId(appId);
        request.setAppSecret(appSecret);
        // 触发重新发送ticket后，ticket在接收ticket事件引擎更新
        try {
            getRestTemplate().postForObject(StrUtil.join("/", API_URL_BASE, RESEND_APP_TICKET), request, FeishuResendAppTicketResponse.class);
        }
        catch (RestClientException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public AuthOperations authOperations() {
        return this.authOperations;
    }

    @Override
    public AppOperations appOperations() {
        return this.appOperations;
    }

    @Override
    public ContactOperations contactOperations() {
        return contactOperations;
    }

    @Override
    public UserOperations userOperations() {
        return this.userOperations;
    }

    @Override
    public DepartmentOperations departmentOperations() {
        return this.departmentOperations;
    }

    @Override
    public BotOperations botOperations() {
        return this.botOperations;
    }

    @Override
    public MessageOperations messageOperations() {
        return this.messageOperations;
    }

    @Override
    public TenantOperations tenantOperations() {
        return this.tenantOperations;
    }

    @Override
    public ImageOperations imageOperations() {
        return this.imageOperations;
    }
}
