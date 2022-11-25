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
 * Feishu A service class that actively calls HTTP requests
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
     * Store the app configurator, wouldn't it be bad to store too much?
     */
    private Map<String, FeishuConfigStorage> configStorageMap;

    public FeishuTemplate() {
        // Configure Rest Template
        configureRestTemplate();
    }

    /**
     * The abstract base class has set the default request client factory,
     * wraps the request again, and the response body stream can be read repeatedly
     *
     * @param requestFactory Request factory
     * @return ClientHttpRequestFactory
     */
    private static ClientHttpRequestFactory bufferRequestWrapper(ClientHttpRequestFactory requestFactory) {
        return new BufferingClientHttpRequestFactory(requestFactory);
    }

    public void setTicketStorage(AppTicketStorage ticketStorage) {
        this.ticketStorage = ticketStorage;
    }

    /**
     * call to construct instance, add default memory
     */
    public void prepareTicketConfig() {
        // If you have a store app from the start, you must configure the store app ticket store
        if (this.ticketStorage == null) {
            throw new IllegalStateException("Independent service provider applications need to provide the implementation of Ticket storage, "
                    + "please implement the App Ticket Storage interface and inject it into Template");
        }
        // Actively trigger re-send ticket at startup
        LOGGER.info("Feishu ISV[{}], actively trigger re send ticket", defaultConfigStorage.getAppId());
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
            throw new HttpException("Failed to get access token response:" + response.body());
        }
        try {
            return Jackson4FeishuConverter.toObject(response.body(), new TypeReference<FeishuPassportAccessToken>() {});
        }
        catch (IOException e) {
            throw new HttpException("Failed to parse response body:" + response.body(), e);
        }
    }

    public FeishuPassportUserInfo getPassportUserInfo(String accessToken) {
        HttpResponse response = HttpUtil.createGet(PASSPORT_USER_INFO_URL)
                .bearerAuth(accessToken)
                .execute();
        if (!response.isOk()) {
            throw new HttpException("Failed to get user identity information response:" + response.body());
        }
        try {
            return Jackson4FeishuConverter.toObject(response.body(), new TypeReference<FeishuPassportUserInfo>() {});
        }
        catch (IOException e) {
            throw new HttpException("Failed to parse response body:" + response.body(), e);
        }
    }

    public FeishuConfigStorage getDefaultConfigStorage() {
        return defaultConfigStorage;
    }

    public void setDefaultConfigStorage(FeishuConfigStorage configStorage) {
        this.defaultConfigStorage = configStorage;
        addConfigStorage(configStorage);
    }

    public boolean isDefaultIsv() {
        return defaultConfigStorage.isv();
    }

    public void addConfigStorage(FeishuConfigStorage configStorage) {
        LOGGER.info("add new configuration");
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
            LOGGER.error("The current application configuration memory is empty and the application "
                    + "configuration cannot be obtained");
            return null;
        }

        // When obtaining the current context storage, if there are multiple application configurations,
        // you must call the switch To method to switch the context
        if (StrUtil.isBlank(FeishuConfigStorageHolder.get())) {
            // The current context application identification variable is not set, return null
            LOGGER.error("There is currently no application context, unable to get application configuration");
            return null;
        }
        return this.configStorageMap.get(FeishuConfigStorageHolder.get());
    }

    public void removeConfigStorage(String appId) {
        synchronized (this) {
            if (this.configStorageMap.size() == 1) {
                this.configStorageMap.remove(appId);
                LOGGER.warn("Last configuration removed: {}, must be added now using set Wx Mp Config Storage or set Multi Config Storages", appId);
                return;
            }
            if (FeishuConfigStorageHolder.get().equals(appId)) {
                this.configStorageMap.remove(appId);
                final String defaultAppId = this.configStorageMap.keySet().iterator().next();
                LOGGER.warn("The default configuration has been deleted, [{}] is set as the default configuration", defaultAppId);
                return;
            }
            this.configStorageMap.remove(appId);
        }
    }

    /**
     * Switch the default app configuration context
     */
    public synchronized void switchDefault() {
        if (this.configStorageMap == null) {
            LOGGER.error("Configuration memory is empty, cannot switch default application context!");
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
     * Switch application configuration context
     * @param configStorage Storage
     */
    public synchronized void switchTo(FeishuConfigStorage configStorage) {
        if (this.configStorageMap == null) {
            // never used
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
                // Enterprise store app
                if (ticketStorage == null) {
                    throw new IllegalStateException("No implementation of Ticket Storage provided");
                }
                String appTicket = ticketStorage.getTicket();
                if (appTicket == null) {
                    throw new IllegalStateException("APP Ticket is not found, maybe not received, wait for a while and get it again");
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
                // Enterprise self-built application
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
                // Enterprise store app
                if (ticketStorage == null) {
                    throw new IllegalStateException("no implementation of ticket storage provided");
                }
                String appTicket = ticketStorage.getTicket();
                if (appTicket == null) {
                    throw new IllegalStateException("APP Ticket is not found, maybe not received, wait for a while and get it again");
                }
                FeishuTenantAccessTokenIsvRequest request = new FeishuTenantAccessTokenIsvRequest();
                request.setAppAccessToken(getAppAccessToken(false));
                request.setTenantKey(tenantKey);
                FeishuTenantAccessTokenIsvResponse response = this.doPost(buildUri(GET_TENANT_ACCESS_TOKEN_ISV), MapUtil.newHashMap(), request, FeishuTenantAccessTokenIsvResponse.class);
                getConfigStorage().updateTenantAccessToken(tenantKey, response.getTenantAccessToken(), response.getExpire());
                return response.getTenantAccessToken();
            }
            else {
                // enterprise self built application
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
                throw new FeishuApiException("Failed to request Feishu server, please check network or parameters");
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

    protected String buildUri(String resourceUrl) {
        return StrUtil.concat(false, API_URL_BASE, resourceUrl);
    }

    private void configureRestTemplate() {
        super.setRequestFactory(bufferRequestWrapper(getRestTemplate().getRequestFactory()));
        // Set up a request interceptor
        getRestTemplate().getInterceptors().add(userAgentInterceptor());
        // Response result error custom interception
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
        // Customizable factory class
        super.setRequestFactory(bufferRequestWrapper(requestFactory));
    }

    @Override
    protected MappingJackson2HttpMessageConverter getJsonMessageConverter() {
        // Configure message converters
        MappingJackson2HttpMessageConverter converter = super.getJsonMessageConverter();
        // All API request parameters of Feishu are in underlined format, and the attributes of the response structure are also underlined
        converter.getObjectMapper().setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
        converter.getObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return converter;
    }

    /**
     * Need to trigger in two cases:
     * 1. When starting the project, initialize the ISV store application instance, then you need to trigger the first time
     * 2. The store application instance can trigger verification when the event url is verified.
     */
    public void resendAppTicket(String appId, String appSecret) {
        FeishuResendAppTicketRequest request = new FeishuResendAppTicketRequest();
        request.setAppId(appId);
        request.setAppSecret(appSecret);
        // After triggering the resend of the ticket, the ticket is updated in the receiving ticket event engine
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

    protected interface ClientCallable<T> {

        /**
         * do whatever you want
         *
         * @return T
         * @throws FeishuApiException Feishu exception
         */
        T doExecute() throws FeishuApiException;
    }
}
