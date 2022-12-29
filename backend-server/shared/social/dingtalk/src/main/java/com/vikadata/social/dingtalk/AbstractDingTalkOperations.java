package com.vikadata.social.dingtalk;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;

import cn.hutool.core.util.StrUtil;

import com.vikadata.social.core.AbstractOperations;
import com.vikadata.social.core.AppTicketStorage;
import com.vikadata.social.core.ConfigStorage;
import com.vikadata.social.dingtalk.DingtalkConfig.AgentApp;
import com.vikadata.social.dingtalk.DingtalkConfig.IsvApp;
import com.vikadata.social.dingtalk.exception.DingTalkApiException;
import com.vikadata.social.dingtalk.model.BaseResponse;
import com.vikadata.social.dingtalk.model.DingTalkAppAccessTokenResponse;
import com.vikadata.social.dingtalk.model.DingTalkAppJsApiTicketResponse;
import com.vikadata.social.dingtalk.model.DingTalkCorpAccessTokenRequest;
import com.vikadata.social.dingtalk.model.DingTalkSignature;
import com.vikadata.social.dingtalk.model.DingTalkSsoAccessTokenResponse;
import com.vikadata.social.dingtalk.model.DingTalkSuiteAccessTokenRequest;
import com.vikadata.social.dingtalk.model.DingTalkSuiteAccessTokenResponse;
import com.vikadata.social.dingtalk.util.DingTalkSignatureUtil;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import static com.vikadata.social.dingtalk.DingTalkBase.API_URL_BASE;
import static com.vikadata.social.dingtalk.DingTalkBase.API_V1_URL_BASE;

/**
 * DingTalk api abstract class
 */
public abstract class AbstractDingTalkOperations extends AbstractOperations {
    private static final String AUTH_CORP_ACCESS_TOKEN_KEY = "%s:%s";

    private static final String JS_API_TICKET_ACCESS_TOKEN_KEY_TPL = "jsapi:%s:%s";

    private static final String GET_CORP_APP_ACCESS_TOKEN = "/service/get_corp_token";

    private static final String GET_APP_ACCESS_TOKEN = "/gettoken";

    private static final String GET_SSO_ACCESS_TOKEN = "/sso/gettoken";

    private static final String GET_JS_API_TICKET = "/get_jsapi_ticket";

    private static final String GET_ISV_SUITE_ACCESS_TOKEN = "/service/get_suite_token";

    private ConfigStorage configStorage;

    private DingtalkConfig dingtalkConfig;

    private HashMap<String, AppTicketStorage> suiteTicketStorage;

    public ConfigStorage getConfigStorage() {
        return configStorage;
    }

    public HashMap<String, AppTicketStorage> getSuiteTicketStorage() {
        return suiteTicketStorage;
    }

    public DingtalkConfig getDingtalkConfig() {
        return dingtalkConfig;
    }

    public void setConfigStorage(ConfigStorage configStorage) {
        this.configStorage = configStorage;
    }

    public AbstractDingTalkOperations(RestTemplate restTemplate) {
        super(restTemplate);
    }

    public AbstractDingTalkOperations(RestTemplate restTemplate, DingtalkConfig dingtalkConfig) {
        super(restTemplate);
        this.dingtalkConfig = dingtalkConfig;
    }

    public AbstractDingTalkOperations(RestTemplate restTemplate, DingtalkConfig dingtalkConfig, ConfigStorage configStorage) {
        super(restTemplate);
        this.configStorage = configStorage;
        this.dingtalkConfig = dingtalkConfig;
    }

    public AbstractDingTalkOperations(RestTemplate restTemplate, DingtalkConfig dingtalkConfig,
            ConfigStorage configStorage, HashMap<String, AppTicketStorage> suiteTicketStorage) {
        super(restTemplate);
        this.configStorage = configStorage;
        this.dingtalkConfig = dingtalkConfig;
        this.suiteTicketStorage = suiteTicketStorage;
    }

    protected String buildUri(String resourceUrl) {
        return StrUtil.concat(false, API_URL_BASE, resourceUrl);
    }

    protected String buildV1Uri(String resourceUrl) {
        return StrUtil.concat(false, API_V1_URL_BASE, resourceUrl);
    }

    protected <T extends BaseResponse> T doGet(String url, Map<String, String> headers, Class<T> responseClass) throws DingTalkApiException {
        try {
            HttpHeaders header = null;
            if (headers != null && !headers.isEmpty()) {
                header = new HttpHeaders();
                headers.forEach(header::add);
            }
            HttpEntity<Void> request = new HttpEntity<>(header);
            ResponseEntity<T> response = restTemplate.exchange(url, HttpMethod.GET, request, responseClass);
            return handleResponse(response);
        }
        catch (RestClientException e) {
            throw new DingTalkApiException(e.getMessage());
        }
    }

    protected <T extends BaseResponse> T doPost(String url, Map<String, String> headers, Object requestBody, Class<T> responseClass) throws DingTalkApiException {
        try {
            HttpHeaders header = new HttpHeaders();
            if (headers != null && !headers.isEmpty()) {
                headers.forEach(header::add);
            }
            // The post request needs to set the contentType
            if (headers != null && headers.get("Content-Type") == null) {
                header.setContentType(MediaType.APPLICATION_JSON);
            }
            HttpEntity<Object> entity = new HttpEntity<>(requestBody, header);
            ResponseEntity<T> response = restTemplate.postForEntity(URI.create(url), entity, responseClass);
            return handleResponse(response);
        }
        catch (RestClientException e) {
            throw new DingTalkApiException(e.getMessage());
        }
    }

    /**
     * get the access token of the internal application
     * @param appKey The unique identification key of the application
     * @param appSecret Application secret key value
     * @param forceRefresh Whether to force refresh
     * @return access_token
     */
    protected String getAppAccessToken(String appKey, String appSecret, boolean forceRefresh) {
        if (!configStorage.isTenantAccessTokenExpired(appKey) && !forceRefresh) {
            return configStorage.getTenantAccessToken(appKey);
        }
        Lock lock = configStorage.getTenantAccessTokenLock(appKey);
        boolean locked = false;
        try {
            do {
                locked = lock.tryLock(100, TimeUnit.MILLISECONDS);
                if (!configStorage.isTenantAccessTokenExpired(appKey) && !forceRefresh) {
                    return configStorage.getTenantAccessToken(appKey);
                }
            } while (!locked);
            Map<String, String> map = new HashMap<>(2);
            map.put("appkey", appKey);
            map.put("appsecret", appSecret);
            String fullUrl = buildUrlWithQueryStr(buildUri(GET_APP_ACCESS_TOKEN),
                    DingTalkSignatureUtil.paramToQueryString(map));
            DingTalkAppAccessTokenResponse response = doGet(fullUrl, new HashMap<>(), DingTalkAppAccessTokenResponse.class);
            configStorage.updateTenantAccessToken(appKey, response.getAccessToken(), response.getExpiresIn());
            return response.getAccessToken();
        }
        catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        catch (DingTalkApiException e) {
            throw new IllegalStateException(e);
        }
        finally {
            if (locked) {
                lock.unlock();
            }
        }
    }

    /**
     * get the access token of the isv application of the auth
     *
     * @param forceRefresh Whether to force refresh
     * @return String
     */
    protected String getCorpAppAccessToken(DingTalkSignature request, String authCorpId, boolean forceRefresh) {
        String key = String.format(AUTH_CORP_ACCESS_TOKEN_KEY, authCorpId, request.getAccessKey());
        if (!configStorage.isTenantAccessTokenExpired(key) && !forceRefresh) {
            return configStorage.getTenantAccessToken(key);
        }
        Lock lock = configStorage.getTenantAccessTokenLock(key);
        boolean locked = false;
        try {
            do {
                locked = lock.tryLock(100, TimeUnit.MILLISECONDS);
                if (!configStorage.isTenantAccessTokenExpired(key) && !forceRefresh) {
                    return configStorage.getTenantAccessToken(key);
                }
            } while (!locked);
            String fullUrl = buildSignatureUrl(GET_CORP_APP_ACCESS_TOKEN, request.getAccessKey(),
                    request.getAppSecret(), request.getSuiteTicket());
            DingTalkCorpAccessTokenRequest body = new DingTalkCorpAccessTokenRequest();
            body.setAuthCorpid(authCorpId);
            DingTalkAppAccessTokenResponse response = doPost(fullUrl, new HashMap<>(), body, DingTalkAppAccessTokenResponse.class);
            configStorage.updateTenantAccessToken(key, response.getAccessToken(), response.getExpiresIn());
            return response.getAccessToken();
        }
        catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        catch (DingTalkApiException e) {
            throw new IllegalStateException(e);
        }
        finally {
            if (locked) {
                lock.unlock();
            }
        }
    }

    /**
     * get isv app access_token
     *
     * @param forceRefresh Whether to force refresh
     * @return String
     */
    protected String getIsvSuiteAccessToken(DingTalkSuiteAccessTokenRequest request, boolean forceRefresh) {
        String suiteKey = request.getSuiteKey();
        if (!configStorage.isTenantAccessTokenExpired(suiteKey) && !forceRefresh) {
            return configStorage.getTenantAccessToken(suiteKey);
        }
        Lock lock = configStorage.getTenantAccessTokenLock(suiteKey);
        boolean locked = false;
        try {
            do {
                locked = lock.tryLock(100, TimeUnit.MILLISECONDS);
                if (!configStorage.isTenantAccessTokenExpired(suiteKey) && !forceRefresh) {
                    return configStorage.getTenantAccessToken(suiteKey);
                }
            } while (!locked);
            DingTalkSuiteAccessTokenResponse response = doPost(buildUri(GET_ISV_SUITE_ACCESS_TOKEN), new HashMap<>(),
                    request, DingTalkSuiteAccessTokenResponse.class);
            configStorage.updateTenantAccessToken(suiteKey, response.getSuiteAccessToken(), response.getExpiresIn());
            return response.getSuiteAccessToken();
        }
        catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        catch (DingTalkApiException e) {
            throw new IllegalStateException(e);
        }
        finally {
            if (locked) {
                lock.unlock();
            }
        }
    }

    protected String getIsvJsApiTicket(String suiteKey, String authCorpId, String accessToken, Boolean forceRefresh) {
        String key = String.format(JS_API_TICKET_ACCESS_TOKEN_KEY_TPL, authCorpId, suiteKey);
        if (!configStorage.isTenantAccessTokenExpired(key) && !forceRefresh) {
            return configStorage.getTenantAccessToken(key);
        }
        Lock lock = configStorage.getTenantAccessTokenLock(key);
        boolean locked = false;
        try {
            do {
                locked = lock.tryLock(100, TimeUnit.MILLISECONDS);
                if (!configStorage.isTenantAccessTokenExpired(key) && !forceRefresh) {
                    return configStorage.getTenantAccessToken(key);
                }
            } while (!locked);
            String fullUrl = buildAccessTokenUrl(GET_JS_API_TICKET, accessToken);
            DingTalkCorpAccessTokenRequest body = new DingTalkCorpAccessTokenRequest();
            body.setAuthCorpid(authCorpId);
            DingTalkAppJsApiTicketResponse response = doGet(fullUrl, new HashMap<>(), DingTalkAppJsApiTicketResponse.class);
            configStorage.updateTenantAccessToken(key, response.getTicket(), response.getExpiresIn());
            return response.getTicket();
        }
        catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        catch (DingTalkApiException e) {
            throw new IllegalStateException(e);
        }
        finally {
            if (locked) {
                lock.unlock();
            }
        }
    }


    /**
     * get the access token of the authorized corporate
     * @param agentId Enterprise internal authorization application agent Id
     * @param forceRefresh Whether to force refresh
     * @return String
     */
    protected String getAgentAccessToken(String agentId, boolean forceRefresh) {
        AgentApp agentApp = dingtalkConfig.getAgentAppStorage().getAgentApp(agentId);
        DingTalkSignature request = new DingTalkSignature();
        request.setAccessKey(agentApp.getCustomKey());
        request.setAppSecret(agentApp.getCustomSecret());
        request.setSuiteTicket(agentApp.getSuiteTicket());
        return getCorpAppAccessToken(request, agentApp.getCorpId(), forceRefresh);
    }

    /**
     * get isv app access_token
     * @param suiteId suite id
     * @param forceRefresh Whether to force refresh
     * @param authCorpId The corpid of the authorized enterprise
     * @return access_token
     */
    protected String getIsvAppAccessToken(String suiteId, String authCorpId, boolean forceRefresh) {
        IsvApp isvApp = dingtalkConfig.getIsvAppMap().get(suiteId);
        DingTalkSignature request = new DingTalkSignature();
        request.setAccessKey(isvApp.getSuiteKey());
        request.setAppSecret(isvApp.getSuiteSecret());
        request.setSuiteTicket(suiteTicketStorage.get(suiteId).getTicket());
        return getCorpAppAccessToken(request, authCorpId, forceRefresh);
    }

    /**
     * get the suite access token for isv applications.
     * The suite access token is mainly used to obtain the information of the isv application, and the suite
     * access token of the isv application will be used when calling the following interfaces:
     * get a permanent authorization code for an authorized enterprise,
     * get basic information about authorized apps,
     * get enterprise authorization information,
     * activate the app
     * @param suiteId suite id
     * @param forceRefresh Whether to force refresh
     * @return access_token
     */
    protected String getIsvSuiteAccessToken(String suiteId, boolean forceRefresh) {
        IsvApp isvApp = dingtalkConfig.getIsvAppMap().get(suiteId);
        DingTalkSuiteAccessTokenRequest request = new DingTalkSuiteAccessTokenRequest();
        request.setSuiteKey(isvApp.getSuiteKey());
        request.setSuiteSecret(isvApp.getSuiteSecret());
        request.setSuiteTicket(suiteTicketStorage.get(suiteId).getTicket());
        return getIsvSuiteAccessToken(request, forceRefresh);
    }

    /**
     * Get the access token of the micro-app admin background without logging in
     * @param corpId isv corporate id
     * @param corpSecret the isv sso secret
     * @return access_token
     */
    protected String getSsoAccessToken(String corpId, String corpSecret) {
        Map<String, String> map = new HashMap<>(2);
        map.put("corpid", corpId);
        map.put("corpsecret", corpSecret);
        String fullUrl = buildUrlWithQueryStr(buildUri(GET_SSO_ACCESS_TOKEN),
                DingTalkSignatureUtil.paramToQueryString(map));
        DingTalkSsoAccessTokenResponse response = doGet(fullUrl, new HashMap<>(), DingTalkSsoAccessTokenResponse.class);
        return response.getAccessToken();
    }

    /**
     * get full url
     *
     * @param url dingtalk api url
     * @param queryStr The processed parameter string
     * @return full request url
     */
    public static String buildUrlWithQueryStr(String url, String queryStr) {
        String fullUrl;
        if (url.indexOf("?") > 0) {
            fullUrl = url + "&" + queryStr;
        }
        else {
            fullUrl = url + "?" + queryStr;
        }
        return fullUrl;
    }

    protected String buildSignatureUrl(String resourceUrl, String accessKey, String appSecret) {
        return buildSignatureUrl(resourceUrl, accessKey, appSecret, null);
    }

    protected String buildSignatureUrl(String resourceUrl, String accessKey, String appSecret, String suiteTicket) {
        Long timestamp = System.currentTimeMillis();
        String canonicalString = DingTalkSignatureUtil.getCanonicalStringForIsv(timestamp, suiteTicket);
        String signature = DingTalkSignatureUtil.computeSignature(appSecret, canonicalString);
        Map<String, String> ps = new HashMap<>();
        ps.put("accessKey", accessKey);
        ps.put("signature", signature);
        ps.put("timestamp", timestamp + "");
        if (suiteTicket != null) {
            ps.put("suiteTicket", suiteTicket);
        }
        String queryStr = DingTalkSignatureUtil.paramToQueryString(ps);
        return buildUrlWithQueryStr(buildUri(resourceUrl), queryStr);
    }

    protected String buildAccessTokenUrl(String resourceUrl, String accessToken) {
        Map<String, String> map = new HashMap<>(1);
        map.put("access_token", accessToken);
        String queryStr = DingTalkSignatureUtil.paramToQueryString(map);
        return buildUrlWithQueryStr(buildUri(resourceUrl), queryStr);
    }

    protected String buildUrlWithSuiteAccessToken(String resourceUrl, String suiteAccessToken) {
        Map<String, String> map = new HashMap<>(1);
        map.put("suite_access_token", suiteAccessToken);
        String queryStr = DingTalkSignatureUtil.paramToQueryString(map);
        return buildUrlWithQueryStr(buildUri(resourceUrl), queryStr);
    }

    protected interface ClientCallable<T> {

        /**
         * do whatever you want
         * @return T
         * @throws DingTalkApiException
         */
        T doExecute() throws DingTalkApiException;
    }

    private <T extends BaseResponse> T handleResponse(ResponseEntity<T> responseEntity) throws DingTalkApiException {
        if (responseEntity == null) {
            throw new DingTalkApiException("response message can not be null");
        }
        if (!responseEntity.getStatusCode().is2xxSuccessful()) {
            if (responseEntity.getBody() != null) {
                throw new DingTalkApiException(responseEntity.getBody().getErrcode(), responseEntity.getBody().getErrmsg());
            }
            else {
                throw new DingTalkApiException("Failed to request DingTalk server, please check network or parameters");
            }
        }
        if (responseEntity.getBody() != null) {
            if (responseEntity.getBody().getErrcode() != 0) {
                if (responseEntity.getBody().getSubCode() != null) {
                    throw new DingTalkApiException(responseEntity.getBody().getSubCode(),
                            responseEntity.getBody().getSubMsg());
                }
                throw new DingTalkApiException(responseEntity.getBody().getErrcode(), responseEntity.getBody().getErrmsg());
            }
        }
        return responseEntity.getBody();
    }

}
