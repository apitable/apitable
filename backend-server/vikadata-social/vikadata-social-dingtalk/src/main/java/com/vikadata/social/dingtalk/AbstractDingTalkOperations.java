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
 * 钉钉 api 抽象类
 *
 * @author Zoe Zheng
 * @date 2021-04-06 16:54:57
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
            // post 请求 需要设置contentType
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
     * 获取企业内部应用的access_token
     *
     * @param appKey 应用的唯一标识key
     * @param appSecret 应用的密钥
     * @param forceRefresh 是否强制刷新
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
     * 获取第三方应用授权企业的access_token
     *
     * @param forceRefresh 是否强制刷新
     * @return String
     * @author zoe zheng
     * @date 2021/4/19 5:45 下午
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
     * 获取第三方应用授权企业的access_token
     *
     * @param forceRefresh 是否强制刷新
     * @return String
     * @author zoe zheng
     * @date 2021/4/19 5:45 下午
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
     * 获取授权第三方企业应用的授权企业的access_token
     *
     * @param agentId 企业内部授权应用agentId
     * @param forceRefresh 是否强制刷新
     * @return String
     * @author zoe zheng
     * @date 2021/4/19 5:43 下午
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
     * 获取第三方应用授权企业的access_token
     *
     * @param suiteId 套件ID
     * @param forceRefresh 是否强制刷新
     * @param authCorpId 授权企业的corpid
     * @return access_token
     * @author zoe zheng
     * @date 2021/9/13 6:01 下午
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
     * 获取第三方企业应用的suite_access_token
     * 该suite_access_token主要用于获取第三方企业应用的信息，在调用以下接口时会使用第三方企业应用的suite_access_token：
     * 获取授权企业的永久授权码
     * 获取授权应用的基本信息
     * 获取企业授权信息
     * 激活应用
     *
     * @param suiteId 套件ID
     * @param forceRefresh 是否强制刷新
     * @return access_token
     * @author zoe zheng
     * @date 2021/9/13 6:01 下午
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
     * 获取微应用后台免登的access_token
     *
     * @param corpId ISV开发的应用后台免登用的access_token，需使用ISV自己的corpId和SSOsecret来换取，不是管理员所在的企业的。
     * @return access_token
     * @author zoe zheng
     * @date 2021/9/13 6:01 下午
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
     * 获取完整的url
     *
     * @param url dingtalk api url
     * @param queryStr 经过处理的参数string
     * @return 完整的请求url
     * @author zoe zheng
     * @date 2021/5/6 10:47 上午
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
         *
         * @return T
         * @throws DingTalkApiException 飞书异常
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
                throw new DingTalkApiException("请求钉钉服务器失败，请检查网络或者参数");
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
