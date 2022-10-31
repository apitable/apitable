package com.vikadata.social.dingtalk.api.impl;

import java.util.HashMap;
import java.util.List;

import cn.hutool.core.util.StrUtil;

import com.vikadata.social.core.ConfigStorage;
import com.vikadata.social.dingtalk.AbstractDingTalkOperations;
import com.vikadata.social.dingtalk.DingtalkConfig;
import com.vikadata.social.dingtalk.DingtalkConfig.AgentApp;
import com.vikadata.social.dingtalk.api.ServiceCorpAppOperations;
import com.vikadata.social.dingtalk.enums.DingTalkLanguageType;
import com.vikadata.social.dingtalk.enums.DingTalkOrderField;
import com.vikadata.social.dingtalk.exception.DingTalkApiException;
import com.vikadata.social.dingtalk.message.Message;
import com.vikadata.social.dingtalk.model.BaseResponse;
import com.vikadata.social.dingtalk.model.DingTalkAppVisibleScopeRequest;
import com.vikadata.social.dingtalk.model.DingTalkAppVisibleScopeResponse;
import com.vikadata.social.dingtalk.model.DingTalkAsyncSendCorpMessageRequest;
import com.vikadata.social.dingtalk.model.DingTalkAsyncSendCorpMessageResponse;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentDetailRequest;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentDetailResponse;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentDetailResponse.DingTalkDeptDetail;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentSubIdListRequest;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentSubIdListResponse;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentSubListRequest;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentSubListResponse;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentSubListResponse.DingTalkDeptBaseInfo;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentUserIdListResponse;
import com.vikadata.social.dingtalk.model.DingTalkDeptListParentByUserRequest;
import com.vikadata.social.dingtalk.model.DingTalkDeptListParentByUserResponse;
import com.vikadata.social.dingtalk.model.DingTalkDeptListParentByUserResponse.DingTalkUserParentDeptList;
import com.vikadata.social.dingtalk.model.DingTalkDeptParentIdListRequest;
import com.vikadata.social.dingtalk.model.DingTalkDeptParentIdListResponse;
import com.vikadata.social.dingtalk.model.DingTalkRegisterCallbackUrlRequest;
import com.vikadata.social.dingtalk.model.DingTalkServerAuthInfoRequest;
import com.vikadata.social.dingtalk.model.DingTalkServerAuthInfoResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserAdminListResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserAdminListResponse.DingTalkAdminList;
import com.vikadata.social.dingtalk.model.DingTalkUserCountRequest;
import com.vikadata.social.dingtalk.model.DingTalkUserCountResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserDetail;
import com.vikadata.social.dingtalk.model.DingTalkUserDetailRequest;
import com.vikadata.social.dingtalk.model.DingTalkUserDetailResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserInfoV2Request;
import com.vikadata.social.dingtalk.model.DingTalkUserInfoV2Response;
import com.vikadata.social.dingtalk.model.DingTalkUserListRequest;
import com.vikadata.social.dingtalk.model.DingTalkUserListResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserListResponse.UserPageResult;
import com.vikadata.social.dingtalk.model.UserInfoV2;

import org.springframework.web.client.RestTemplate;

import static com.vikadata.social.dingtalk.constants.DingTalkApiConst.SEND_MESSAGE_USER_MAX_COUNT;
import static com.vikadata.social.dingtalk.exception.DingTalkExceptionConstants.MESSAGE_USER_EXCEED_LIMIT;

/**
 * Enterprise internal application implementation class--authorization to third-party enterprises
 */
public class ServiceCorpAppTemplate extends AbstractDingTalkOperations implements ServiceCorpAppOperations {

    private static final String V2_USER_INFO = "/topapi/v2/user/getuserinfo";

    private static final String V2_USER_DETAIL = "/topapi/v2/user/get";

    private static final String USER_COUNT = "/topapi/user/count";

    private static final String DEPARTMENT_SUB_ID_LIST = "/topapi/v2/department/listsubid";

    private static final String DEPARTMENT_SUB_LIST = "/topapi/v2/department/listsub";

    private static final String USER_LIST = "/topapi/v2/user/list";

    private static final String REGISTER_CALLBACK_URL = "/call_back/register_call_back";

    private static final String DELETE_CALLBACK_URL = "/call_back/delete_call_back";

    private static final String ASYNC_SEDN_CORP_CONVERSATION = "/topapi/message/corpconversation/asyncsend_v2";

    private static final String DEPARTMENT_GET = "/topapi/v2/department/get";

    private static final String DEPT_USER_LIST_ID = "/topapi/user/listid";

    private static final String GET_SERVER_AUTH_INFO = "/service/get_auth_info";

    private static final String GET_APP_VISIBLE_SCOPE = "/microapp/visible_scopes";

    private static final String DEPT_LIST_PARENT_BY_USER = "/topapi/v2/department/listparentbyuser";

    private static final String DEPT_LIST_PARENT_BY_DEPT = "/topapi/v2/department/listparentbydept";

    private static final String USER_ADMIN_LIST = "/topapi/user/listadmin";

    private static final String DEPT_PARENT_ID_LIST = "/topapi/v2/department/listparentbydept";

    public ServiceCorpAppTemplate(RestTemplate restTemplate, DingtalkConfig dingtalkConfig, ConfigStorage configStorage) {
        super(restTemplate, dingtalkConfig, configStorage);
    }

    @Override
    public String getAccessToken(String agentId, boolean forceRefresh) {
        return getAgentAccessToken(agentId, forceRefresh);
    }

    @Override
    public UserInfoV2 getUserInfoV2ByCode(String agentId, String code) {
        DingTalkUserInfoV2Request request = new DingTalkUserInfoV2Request();
        request.setCode(code);
        String fullUrl = buildAccessTokenUrl(V2_USER_INFO, getAccessToken(agentId, false));
        DingTalkUserInfoV2Response response = doPost(fullUrl, new HashMap<>(), request,
                DingTalkUserInfoV2Response.class);
        return response.getResult();
    }

    @Override
    public DingTalkUserDetail getUserDetailByUserId(String agentId, String userId) {
        DingTalkUserDetailRequest request = new DingTalkUserDetailRequest();
        request.setUserid(userId);
        String fullUrl = buildAccessTokenUrl(V2_USER_DETAIL, getAccessToken(agentId, false));
        DingTalkUserDetailResponse response = doPost(fullUrl, new HashMap<>(1), request,
                DingTalkUserDetailResponse.class);
        return response.getResult();
    }

    @Override
    public Integer getUserCount(String agentId, Boolean onlyActive) {
        DingTalkUserCountRequest request = new DingTalkUserCountRequest();
        request.setOnlyActive(onlyActive);
        String fullUrl = buildAccessTokenUrl(USER_COUNT, getAccessToken(agentId, false));
        DingTalkUserCountResponse response = doPost(fullUrl, new HashMap<>(1), request,
                DingTalkUserCountResponse.class);
        return response.getResult().getCount();
    }

    @Override
    public List<Long> getDepartmentSubIdList(String agentId, Long dptId) {
        DingTalkDepartmentSubIdListRequest request = new DingTalkDepartmentSubIdListRequest();
        if (dptId != null) {
            request.setDeptId(dptId);
        }
        String fullUrl = buildAccessTokenUrl(DEPARTMENT_SUB_ID_LIST, getAccessToken(agentId, false));
        DingTalkDepartmentSubIdListResponse response = doPost(fullUrl, new HashMap<>(1), request,
                DingTalkDepartmentSubIdListResponse.class);
        return response.getResult().getDeptIdList();
    }

    @Override
    public List<DingTalkDeptBaseInfo> getDepartmentSubList(String agentId, Long dptId, DingTalkLanguageType language) {
        DingTalkDepartmentSubListRequest request = new DingTalkDepartmentSubListRequest();
        request.setDeptId(dptId);
        request.setLanguage(language.getValue());
        String fullUrl = buildAccessTokenUrl(DEPARTMENT_SUB_LIST, getAccessToken(agentId, false));
        DingTalkDepartmentSubListResponse response = doPost(fullUrl, new HashMap<>(1), request,
                DingTalkDepartmentSubListResponse.class);
        return response.getResult();

    }


    @Override
    public UserPageResult getUserList(String agentId, Long deptId, Integer cursor, Integer size, DingTalkOrderField orderField,
            Boolean containAccessLimit, DingTalkLanguageType languageType) {
        DingTalkUserListRequest request = new DingTalkUserListRequest();
        request.setCursor(cursor);
        request.setDeptId(deptId);
        request.setLanguage(languageType.getValue());
        request.setOrderField(orderField.getValue());
        request.setSize(size);
        request.setContainAccessLimit(containAccessLimit);
        String fullUrl = buildAccessTokenUrl(USER_LIST, getAccessToken(agentId, false));
        DingTalkUserListResponse response = doPost(fullUrl, new HashMap<>(1), request,
                DingTalkUserListResponse.class);
        return response.getResult();
    }

    @Override
    public void registerCallbackUrl(String agentId, String url, List<String> callbackTag) {
        DingTalkRegisterCallbackUrlRequest request = new DingTalkRegisterCallbackUrlRequest();
        AgentApp agentApp = getDingtalkConfig().getAgentAppStorage().getAgentApp(agentId);
        request.setUrl(url);
        request.setToken(agentApp.getToken());
        request.setAesKey(agentApp.getAesKey());
        request.setCallBackTag(callbackTag);
        String fullUrl = buildAccessTokenUrl(REGISTER_CALLBACK_URL, getAccessToken(agentId, false));
        doPost(fullUrl, new HashMap<>(1), request, BaseResponse.class);
    }

    @Override
    public void deleteCallbackUrl(String agentId) {
        String fullUrl = buildAccessTokenUrl(DELETE_CALLBACK_URL, getAccessToken(agentId, false));
        doGet(fullUrl, new HashMap<>(1), BaseResponse.class);
    }

    @Override
    public String asyncSendMessageToUser(String agentId, Message message, List<String> userIds) {
        if (userIds.size() > SEND_MESSAGE_USER_MAX_COUNT) {
            throw new DingTalkApiException(MESSAGE_USER_EXCEED_LIMIT, "The number of people exceeds the limit");
        }
        DingTalkAsyncSendCorpMessageRequest request = new DingTalkAsyncSendCorpMessageRequest();
        request.setAgentId(Long.parseLong(agentId));
        request.setToAllUser(false);
        request.setUseridList(StrUtil.join(",", userIds));
        request.setMsg(message.getMsgObj());
        String fullUrl = buildAccessTokenUrl(ASYNC_SEDN_CORP_CONVERSATION, getAccessToken(agentId, false));
        DingTalkAsyncSendCorpMessageResponse response = doPost(fullUrl, new HashMap<>(1), request,
                DingTalkAsyncSendCorpMessageResponse.class);
        return response.getTaskId();
    }

    @Override
    public DingTalkDeptDetail getDeptDetail(String agentId, Long deptId, DingTalkLanguageType language) {
        String fullUrl = buildAccessTokenUrl(DEPARTMENT_GET, getAccessToken(agentId, false));
        DingTalkDepartmentDetailRequest request = new DingTalkDepartmentDetailRequest();
        request.setDeptId(deptId);
        request.setLanguage(language.getValue());
        DingTalkDepartmentDetailResponse response = doPost(fullUrl, new HashMap<>(1), request,
                DingTalkDepartmentDetailResponse.class);
        return response.getResult();
    }

    @Override
    public List<String> getDeptUserIdList(String agentId, Long deptId) {
        String fullUrl = buildAccessTokenUrl(DEPT_USER_LIST_ID, getAccessToken(agentId, false));
        DingTalkDepartmentSubIdListRequest request = new DingTalkDepartmentSubIdListRequest();
        request.setDeptId(deptId);
        DingTalkDepartmentUserIdListResponse response = doPost(fullUrl, new HashMap<>(1), request,
                DingTalkDepartmentUserIdListResponse.class);
        return response.getResult().getUseridList();
    }

    @Override
    public DingTalkServerAuthInfoResponse getServerAuthInfo(String agentId) {
        AgentApp app = getDingtalkConfig().getAgentAppStorage().getAgentApp(agentId);
        String fullUrl = buildSignatureUrl(GET_SERVER_AUTH_INFO, app.getCustomKey(),
                app.getCustomSecret(), app.getSuiteTicket());
        DingTalkServerAuthInfoRequest request = new DingTalkServerAuthInfoRequest();
        request.setAuthCorpid(app.getCorpId());
        request.setSuiteKey(app.getCustomKey());
        return doPost(fullUrl, new HashMap<>(1), request, DingTalkServerAuthInfoResponse.class);
    }

    @Override
    public DingTalkAppVisibleScopeResponse getAppVisibleScopes(String agentId) {
        String fullUrl = buildAccessTokenUrl(GET_APP_VISIBLE_SCOPE, getAccessToken(agentId, false));
        DingTalkAppVisibleScopeRequest request = new DingTalkAppVisibleScopeRequest();
        request.setAgentId(Long.parseLong(agentId));
        return doPost(fullUrl, new HashMap<>(1), request, DingTalkAppVisibleScopeResponse.class);
    }

    @Override
    public DingTalkUserParentDeptList getParentDeptIdByUser(String agentId, String userId) {
        String fullUrl = buildAccessTokenUrl(DEPT_LIST_PARENT_BY_USER, getAccessToken(agentId, false));
        DingTalkDeptListParentByUserRequest request = new DingTalkDeptListParentByUserRequest();
        request.setUserid(userId);
        DingTalkDeptListParentByUserResponse response = doPost(fullUrl, new HashMap<>(1), request,
                DingTalkDeptListParentByUserResponse.class);
        return response.getResult();
    }

    @Override
    public List<DingTalkAdminList> getAdminList(String agentId) {
        String fullUrl = buildAccessTokenUrl(USER_ADMIN_LIST, getAccessToken(agentId, false));
        DingTalkUserAdminListResponse response = doPost(fullUrl, new HashMap<>(1),
                new HashMap<>(1), DingTalkUserAdminListResponse.class);
        return response.getResult();
    }

    @Override
    public List<Long> getDeptParentIdList(String agentId, Long deptId) {
        String fullUrl = buildAccessTokenUrl(DEPT_PARENT_ID_LIST, getAccessToken(agentId, false));
        DingTalkDeptParentIdListRequest request = new DingTalkDeptParentIdListRequest();
        request.setDeptId(deptId);
        DingTalkDeptParentIdListResponse response = doPost(fullUrl, new HashMap<>(1), request,
                DingTalkDeptParentIdListResponse.class);
        return response.getResult().getParentIdList();
    }
}
