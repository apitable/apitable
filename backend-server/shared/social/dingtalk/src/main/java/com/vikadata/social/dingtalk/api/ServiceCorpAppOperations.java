package com.vikadata.social.dingtalk.api;

import java.util.List;

import com.vikadata.social.dingtalk.enums.DingTalkLanguageType;
import com.vikadata.social.dingtalk.enums.DingTalkOrderField;
import com.vikadata.social.dingtalk.message.Message;
import com.vikadata.social.dingtalk.model.DingTalkAppVisibleScopeResponse;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentDetailResponse.DingTalkDeptDetail;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentSubListResponse.DingTalkDeptBaseInfo;
import com.vikadata.social.dingtalk.model.DingTalkDeptListParentByUserResponse.DingTalkUserParentDeptList;
import com.vikadata.social.dingtalk.model.DingTalkServerAuthInfoResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserAdminListResponse.DingTalkAdminList;
import com.vikadata.social.dingtalk.model.DingTalkUserDetail;
import com.vikadata.social.dingtalk.model.DingTalkUserListResponse.UserPageResult;
import com.vikadata.social.dingtalk.model.UserInfoV2;

/**
 * Enterprise internal application interface--authorization to third-party enterprises
 */
public interface ServiceCorpAppOperations {
    /**
     * Obtain an access token for authorizing enterprise applications
     *
     * @param forceRefresh Force refresh
     * @return String
     */
    String getAccessToken(String agentId, boolean forceRefresh);

    /**
     * Obtaining user information through a free code (v 2)
     *
     * @param agentId agent id
     * @param code No-login authorization code
     * @return UserInfoV2
     */
    UserInfoV2 getUserInfoV2ByCode(String agentId, String code);

    /**
     * Get user details based on userid
     *
     * @param agentId application agent id
     * @param userId userid
     * @return DingTalkUserDetailResponse
     */
    DingTalkUserDetail getUserDetailByUserId(String agentId, String userId);

    /**
     * Get the number of employees in the company
     *
     * @param agentId application agent id
     * @param onlyActive Whether to include the number of inactive Dingding
     * @return number of employees
     */
    Integer getUserCount(String agentId, Boolean onlyActive);

    /**
     * Get a list of sub-department IDs
     *
     * @param agentId application agent id
     * @param dptId Parent department ID, root department pass 1
     * @return Sub-department ID list
     */
    List<Long> getDepartmentSubIdList(String agentId, Long dptId);

    /**
     *  Get the department list, Only supports querying of sub-departments at the next level, not multi-level
     *  sub-departments
     * @param agentId application agent id
     * @param dptId Parent department ID, root department pass 1
     * @param language language zh_CN (default) en_US
     * @return Sub-department list
     */
    List<DingTalkDeptBaseInfo> getDepartmentSubList(String agentId, Long dptId, DingTalkLanguageType language);

    /**
     * Get department user details
     * @param agentId application agent id
     * @param deptId Department ID
     * @param cursor The cursor of the paging query, first pass 0, and then pass the next cursor value in the returned parameter.
     * @param size Paging Size
     * @param orderField Sorting Rules for Department Members
     * @param containAccessLimit Whether to return employees with restricted access
     * @param languageType  language
     * @return UserPageResult
     */
    UserPageResult getUserList(String agentId, Long deptId, Integer cursor, Integer size, DingTalkOrderField orderField,
            Boolean containAccessLimit, DingTalkLanguageType languageType);

    /**
     * Register DingTalk application callback event url
     *
     * @param agentId application agent id
     * @param url callback url
     * @param callbackTag Registered event type
     */
    void registerCallbackUrl(String agentId, String url, List<String> callbackTag);

    /**
     * delete callback event interface
     *
     * @param agentId application agent id
     */
    void deleteCallbackUrl(String agentId);

    /**
     * Asynchronously send work notification messages to users
     *
     * @param agentId application agent id
     * @param message message content
     * @param userIds The maximum length of DingTalk user ID is 100
     * @return Created asynchronous send task ID
     */
    String asyncSendMessageToUser(String agentId, Message message, List<String> userIds);

    /**
     * Get department details
     *
     * @param agentId application agent id
     * @param deptId Department ID
     * @param language language
     * @return DingTalk department details
     */
    DingTalkDeptDetail getDeptDetail(String agentId, Long deptId, DingTalkLanguageType language);

    /**
     * Get a list of department user IDs
     *
     * @param agentId application agent id
     * @param deptId Department ID
     * @return DingTalk department user ID list
     */
    List<String> getDeptUserIdList(String agentId, Long deptId);

    /**
     * Obtain enterprise authorization information
     *
     * @param agentId application agent id
     * @return DingTalkServerAuthInfoResponse
     */
    DingTalkServerAuthInfoResponse getServerAuthInfo(String agentId);

    /**
     * Get app contact visibility
     *
     * @param agentId application agent id
     * @return Enterprise authorization information
     */
    DingTalkAppVisibleScopeResponse getAppVisibleScopes(String agentId);

    /**
     * Get a list of all parent departments of a specified user
     *
     * @param agentId Authorized application agent Id
     * @param userId Dingding application user Id
     * @return DeptListParentByUserResponse
     */
    DingTalkUserParentDeptList getParentDeptIdByUser(String agentId, String userId);

    /**
     * Get the list of administrators of DingTalk Enterprise
     *
     * @param agentId agentId
     * @return DingTalkAdminList
     */
    List<DingTalkAdminList> getAdminList(String agentId);

    /**
     * Get a list of all parent departments of a specified department
     *
     * @param agentId agentId
     * @param deptId Department ID
     * @return List of all parent department IDs for this department
     */
    List<Long> getDeptParentIdList(String agentId, Long deptId);
}
