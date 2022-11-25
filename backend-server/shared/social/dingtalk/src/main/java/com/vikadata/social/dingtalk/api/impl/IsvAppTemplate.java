package com.vikadata.social.dingtalk.api.impl;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import cn.hutool.core.util.StrUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.social.core.AppTicketStorage;
import com.vikadata.social.core.ConfigStorage;
import com.vikadata.social.dingtalk.AbstractDingTalkOperations;
import com.vikadata.social.dingtalk.DingtalkConfig;
import com.vikadata.social.dingtalk.DingtalkConfig.IsvApp;
import com.vikadata.social.dingtalk.api.IsvAppOperations;
import com.vikadata.social.dingtalk.enums.DingTalkLanguageType;
import com.vikadata.social.dingtalk.enums.DingTalkMediaType;
import com.vikadata.social.dingtalk.enums.DingTalkOrderField;
import com.vikadata.social.dingtalk.exception.DingTalkApiException;
import com.vikadata.social.dingtalk.model.BaseResponse;
import com.vikadata.social.dingtalk.model.DingTalSendMessageToUserByIdRequest;
import com.vikadata.social.dingtalk.model.DingTalkAsyncSendCorpMessageResponse;
import com.vikadata.social.dingtalk.model.DingTalkCreateApaasAppRequest;
import com.vikadata.social.dingtalk.model.DingTalkCreateApaasAppResponse;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentSubIdListRequest;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentSubIdListResponse;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentUserIdListResponse;
import com.vikadata.social.dingtalk.model.DingTalkInternalOrderFinishRequest;
import com.vikadata.social.dingtalk.model.DingTalkInternalOrderRequest;
import com.vikadata.social.dingtalk.model.DingTalkInternalOrderResponse;
import com.vikadata.social.dingtalk.model.DingTalkMediaUploadResponse;
import com.vikadata.social.dingtalk.model.DingTalkServerAuthInfoRequest;
import com.vikadata.social.dingtalk.model.DingTalkServerAuthInfoResponse;
import com.vikadata.social.dingtalk.model.DingTalkSkuPageRequest;
import com.vikadata.social.dingtalk.model.DingTalkSkuPageResponse;
import com.vikadata.social.dingtalk.model.DingTalkSsoUserInfoResponse;
import com.vikadata.social.dingtalk.model.DingTalkSuiteActiveSuiteRequest;
import com.vikadata.social.dingtalk.model.DingTalkSuiteActiveSuiteResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserCountRequest;
import com.vikadata.social.dingtalk.model.DingTalkUserCountResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserDetailRequest;
import com.vikadata.social.dingtalk.model.DingTalkUserDetailResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserInfoV2Request;
import com.vikadata.social.dingtalk.model.DingTalkUserInfoV2Response;
import com.vikadata.social.dingtalk.model.DingTalkUserListRequest;
import com.vikadata.social.dingtalk.model.DingTalkUserListResponse;
import com.vikadata.social.dingtalk.util.DdConfigSign;
import com.vikadata.social.dingtalk.util.DingTalkSignatureUtil;

import org.springframework.core.io.FileSystemResource;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import static com.vikadata.social.dingtalk.constants.DingTalkApiConst.SEND_MESSAGE_BY_ID_MAX_COUNT;
import static com.vikadata.social.dingtalk.exception.DingTalkExceptionConstants.MESSAGE_USER_EXCEED_LIMIT;
import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

/**
 * Enterprise internal application implementation class--authorization to third-party enterprises
 */
public class IsvAppTemplate extends AbstractDingTalkOperations implements IsvAppOperations {
    private static final Logger LOGGER = LoggerFactory.getLogger(IsvAppTemplate.class);

    private static final String ACTIVE_SUITE = "/service/activate_suite";

    private static final String SSO_USER_INFO = "/sso/getuserinfo";

    private static final String V2_USER_INFO = "/topapi/v2/user/getuserinfo";

    private static final String V2_USER_DETAIL = "/topapi/v2/user/get";

    private static final String DEPARTMENT_SUB_ID_LIST = "/topapi/v2/department/listsubid";

    private static final String USER_LIST = "/topapi/v2/user/list";

    private static final String SEND_MESSAGE_BY_TEMPLATE_ID = "/topapi/message/corpconversation/sendbytemplate";

    private static final String GET_SERVER_AUTH_INFO = "/service/get_auth_info";

    private static final String UPLOAD_MEDIA = "/media/upload";

    private static final String CREATE_APAAS_APP = "/v1.0/microApp/apaasApps";

    private static final String SKU_PAGE_GET = "/topapi/appstore/internal/skupage/get";

    private static final String INTERNAL_ORDER_FINISH = "/topapi/appstore/internal/order/finish";

    private static final String INTERNAL_ORDER_GET = "/topapi/appstore/internal/order/get";

    private static final String USER_COUNT = "/topapi/user/count";

    private static final String DEPT_USER_ID_LIST = "/topapi/user/listid";

    public IsvAppTemplate(RestTemplate restTemplate, DingtalkConfig dingtalkConfig, ConfigStorage configStorage, HashMap<String, AppTicketStorage> suiteTicketStorage) {
        super(restTemplate, dingtalkConfig, configStorage, suiteTicketStorage);
    }

    @Override
    public String getAccessToken(String suiteId, String authCorpId, boolean forceRefresh) {
        return getIsvAppAccessToken(suiteId, authCorpId, forceRefresh);
    }

    @Override
    public String getSuiteAccessToken(String suiteId, boolean forceRefresh) {
        return getIsvSuiteAccessToken(suiteId, false);
    }

    @Override
    public String getJsApiTicket(String suiteId, String authCorpId, boolean forceRefresh) {
        IsvApp app = getDingtalkConfig().getIsvAppMap().get(suiteId);
        return getIsvJsApiTicket(app.getSuiteKey(), authCorpId, getAccessToken(suiteId, authCorpId, false), forceRefresh);
    }

    @Override
    public String ddConfigSign(String suiteId, String authCorpId, String nonceStr, String timestamp, String url) {
        try {
            return DdConfigSign.sign(getJsApiTicket(suiteId, authCorpId, false), nonceStr, Long.parseLong(timestamp), url);
        }
        catch (Exception e) {
            LOGGER.error("dd config sign error", e);
            throw new DingTalkApiException("dd config sign error");
        }
    }

    @Override
    public String getSsoAccessToken(String suiteId) {
        DingtalkConfig config = getDingtalkConfig();
        return getSsoAccessToken(config.getIsvCorpId(), config.getCorpSecret());
    }

    @Override
    public DingTalkServerAuthInfoResponse getAuthCorpInfo(String suiteId, String authCorpId) {
        IsvApp app = getDingtalkConfig().getIsvAppMap().get(suiteId);
        String suiteTicket = getSuiteTicketStorage().get(suiteId).getTicket();
        DingTalkServerAuthInfoRequest request = new DingTalkServerAuthInfoRequest();
        request.setSuiteKey(app.getSuiteKey());
        request.setAuthCorpid(authCorpId);
        String fullUrl = buildSignatureUrl(GET_SERVER_AUTH_INFO, app.getSuiteKey(), app.getSuiteSecret(), suiteTicket);
        return doPost(fullUrl, new HashMap<>(1), request, DingTalkServerAuthInfoResponse.class);
    }

    @Override
    public Boolean activateSuite(String suiteId, String authCorpId, String permanentCode) {
        IsvApp isvApp = getDingtalkConfig().getIsvAppMap().get(suiteId);
        String suiteAccessToken = getIsvSuiteAccessToken(suiteId, false);
        DingTalkSuiteActiveSuiteRequest request = new DingTalkSuiteActiveSuiteRequest();
        request.setSuiteKey(isvApp.getSuiteKey());
        request.setAuthCorpid(authCorpId);
        request.setPermanentCode(permanentCode);
        String fullUrl = buildUrlWithSuiteAccessToken(ACTIVE_SUITE, suiteAccessToken);
        DingTalkSuiteActiveSuiteResponse response = doPost(fullUrl, new HashMap<>(), request,
                DingTalkSuiteActiveSuiteResponse.class);
        return response.getErrcode() == 0;
    }

    @Override
    public DingTalkSsoUserInfoResponse getSsoUserInfoByCode(String suiteId, String code) {
        Map<String, String> params = new HashMap<>(2);
        params.put("code", code);
        params.put("access_token", getSsoAccessToken(suiteId));
        String queryStr = DingTalkSignatureUtil.paramToQueryString(params);
        String fullUrl = buildUrlWithQueryStr(buildUri(SSO_USER_INFO), queryStr);
        return doGet(fullUrl, new HashMap<>(), DingTalkSsoUserInfoResponse.class);
    }

    @Override
    public DingTalkUserInfoV2Response getUserInfoV2ByCode(String suiteId, String authCorpId, String code) {
        DingTalkUserInfoV2Request request = new DingTalkUserInfoV2Request();
        request.setCode(code);
        String fullUrl = buildAccessTokenUrl(V2_USER_INFO, getAccessToken(suiteId, authCorpId, false));
        return doPost(fullUrl, new HashMap<>(), request, DingTalkUserInfoV2Response.class);
    }

    @Override
    public DingTalkUserDetailResponse getUserDetailByUserId(String suiteId, String authCorpId, String userId) {
        DingTalkUserDetailRequest request = new DingTalkUserDetailRequest();
        request.setUserid(userId);
        String fullUrl = buildAccessTokenUrl(V2_USER_DETAIL, getAccessToken(suiteId, authCorpId, false));
        return doPost(fullUrl, new HashMap<>(1), request, DingTalkUserDetailResponse.class);
    }

    @Override
    public DingTalkDepartmentSubIdListResponse getDepartmentSubIdList(String suiteId, String authCorpId, Long deptId) {
        DingTalkDepartmentSubIdListRequest request = new DingTalkDepartmentSubIdListRequest();
        if (deptId != null) {
            request.setDeptId(deptId);
        }
        String fullUrl = buildAccessTokenUrl(DEPARTMENT_SUB_ID_LIST, getAccessToken(suiteId, authCorpId, false));
        return doPost(fullUrl, new HashMap<>(1), request,
                DingTalkDepartmentSubIdListResponse.class);
    }

    @Override
    public DingTalkUserListResponse getUserList(String suiteId, String authCorpId, Long deptId, Integer cursor, Integer size, DingTalkOrderField orderField,
            Boolean containAccessLimit, DingTalkLanguageType languageType) {
        DingTalkUserListRequest request = new DingTalkUserListRequest();
        request.setCursor(cursor);
        request.setDeptId(deptId);
        request.setLanguage(languageType.getValue());
        request.setOrderField(orderField.getValue());
        request.setSize(size);
        request.setContainAccessLimit(containAccessLimit);
        String fullUrl = buildAccessTokenUrl(USER_LIST, getAccessToken(suiteId, authCorpId, false));
        return doPost(fullUrl, new HashMap<>(1), request,
                DingTalkUserListResponse.class);
    }

    @Override
    public DingTalkAsyncSendCorpMessageResponse sendMessageToUserByTemplateId(String suiteId, String authCorpId,
            String agentId, String templateId, String data, List<String> userIds) {
        if (userIds.size() > SEND_MESSAGE_BY_ID_MAX_COUNT) {
            throw new DingTalkApiException(MESSAGE_USER_EXCEED_LIMIT, "The number of people exceeds the limit");
        }
        DingTalSendMessageToUserByIdRequest request = new DingTalSendMessageToUserByIdRequest();
        request.setAgentId(Long.parseLong(agentId));
        request.setUseridList(StrUtil.join(",", userIds));
        request.setData(data);
        request.setTemplateId(templateId);
        String fullUrl = buildAccessTokenUrl(SEND_MESSAGE_BY_TEMPLATE_ID, getAccessToken(suiteId, authCorpId, false));
        return doPost(fullUrl, new HashMap<>(1), request,
                DingTalkAsyncSendCorpMessageResponse.class);
    }

    @Override
    public DingTalkCreateApaasAppResponse createMicroApaasApp(String suiteId, String authCorpId, DingTalkCreateApaasAppRequest request) {
        HashMap<String, String> header = new HashMap<>(1);
        header.put("x-acs-dingtalk-access-token", getAccessToken(suiteId, authCorpId, false));
        return doPost(buildV1Uri(CREATE_APAAS_APP), header, request, DingTalkCreateApaasAppResponse.class);
    }

    @Override
    public DingTalkMediaUploadResponse uploadMedia(String suiteId, String authCorpId, DingTalkMediaType mediaType, File file) {
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("media", new FileSystemResource(file));
        body.add("type", mediaType.getValue());
        String fullUrl = buildAccessTokenUrl(UPLOAD_MEDIA, getAccessToken(suiteId, authCorpId, false));
        HashMap<String, String> headers = new HashMap<>();
        headers.put("Content-Type", MULTIPART_FORM_DATA_VALUE);
        return doPost(fullUrl, headers, body, DingTalkMediaUploadResponse.class);
    }

    @Override
    public DingTalkSkuPageResponse getInternalSkuPage(String suiteId, String authCorpId, String goodsCode, String callbackPage, String extendParam) {
        DingTalkSkuPageRequest request = new DingTalkSkuPageRequest();
        request.setGoodsCode(goodsCode);
        if (StrUtil.isNotBlank(callbackPage)) {
            request.setCallbackPage(callbackPage);
        }
        if (StrUtil.isNotBlank(extendParam)) {
            request.setExtendParam(extendParam);
        }
        String fullUrl = buildAccessTokenUrl(SKU_PAGE_GET, getAccessToken(suiteId, authCorpId, false));
        return doPost(fullUrl, new HashMap<>(1), request, DingTalkSkuPageResponse.class);
    }

    @Override
    public BaseResponse internalOrderFinish(String suiteId, String authCorpId, String orderId) {
        DingTalkInternalOrderFinishRequest request = new DingTalkInternalOrderFinishRequest();
        request.setBizOrderId(Long.parseLong(orderId));
        String fullUrl = buildAccessTokenUrl(INTERNAL_ORDER_FINISH, getAccessToken(suiteId, authCorpId, false));
        return doPost(fullUrl, new HashMap<>(1), request, BaseResponse.class);
    }

    @Override
    public DingTalkInternalOrderResponse getInternalOrder(String suiteId, String authCorpId, String orderId) {
        DingTalkInternalOrderRequest request = new DingTalkInternalOrderRequest();
        request.setBizOrderId(Long.parseLong(orderId));
        String fullUrl = buildAccessTokenUrl(INTERNAL_ORDER_GET, getAccessToken(suiteId, authCorpId, false));
        return doPost(fullUrl, new HashMap<>(1), request, DingTalkInternalOrderResponse.class);
    }

    @Override
    public Integer getUserCount(String suiteId, String authCorpId, Boolean onlyActive) {
        DingTalkUserCountRequest request = new DingTalkUserCountRequest();
        request.setOnlyActive(onlyActive);
        String fullUrl = buildAccessTokenUrl(USER_COUNT, getAccessToken(suiteId, authCorpId, false));
        DingTalkUserCountResponse response = doPost(fullUrl, new HashMap<>(1), request,
                DingTalkUserCountResponse.class);
        return response.getResult().getCount();
    }

    @Override
    public DingTalkDepartmentUserIdListResponse getUserIdListByDeptId(String suiteId, String authCorpId, Long deptId) {
        String fullUrl = buildAccessTokenUrl(DEPT_USER_ID_LIST, getAccessToken(suiteId, authCorpId, false));
        DingTalkDepartmentSubIdListRequest request = new DingTalkDepartmentSubIdListRequest();
        request.setDeptId(deptId);
        return doPost(fullUrl, new HashMap<>(1), request,
                DingTalkDepartmentUserIdListResponse.class);
    }
}
