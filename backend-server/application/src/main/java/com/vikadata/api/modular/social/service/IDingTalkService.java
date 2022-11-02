package com.vikadata.api.modular.social.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.vikadata.api.modular.social.model.DingTalkContactDTO;
import com.vikadata.api.modular.social.model.DingTalkContactDTO.DingTalkDepartmentDTO;
import com.vikadata.api.modular.social.model.DingTalkContactDTO.DingTalkUserDTO;
import com.vikadata.social.dingtalk.DingtalkConfig;
import com.vikadata.social.dingtalk.DingtalkConfig.AgentApp;
import com.vikadata.social.dingtalk.enums.DingTalkLanguageType;
import com.vikadata.social.dingtalk.message.Message;
import com.vikadata.social.dingtalk.model.DingTalkAppVisibleScopeResponse;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentDetailResponse.DingTalkDeptDetail;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentSubListResponse.DingTalkDeptBaseInfo;
import com.vikadata.social.dingtalk.model.DingTalkDeptListParentByUserResponse.DingTalkUserParentDeptList;
import com.vikadata.social.dingtalk.model.DingTalkServerAuthInfoResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserDetail;
import com.vikadata.social.dingtalk.model.DingTalkUserListResponse.UserPageResult;
import com.vikadata.social.dingtalk.model.UserInfo;
import com.vikadata.social.dingtalk.model.UserInfoV2;

/**
 * <p>
 * DingTalk integration service interface
 * </p>
 */
public interface IDingTalkService {
    /**
     * Obtain user information according to temporary authorization code
     *
     * @param agentId Applied agentId
     * @param code Temporary authorization code
     */
    UserInfoV2 getUserInfoByCode(String agentId, String code);

    /**
     * Obtain user details according to user ID
     *
     * @param agentId Applied agentId
     * @param userId DingTalk Application UserId
     * @return DingTalkUserDetailResponse
     */
    DingTalkUserDetail getUserDetailByUserId(String agentId, String userId);

    /**
     * Obtain user details according to temporary authorization code
     *
     * @param agentId Applied agentId
     * @param userId DingTalk Application UserId
     * @return DingTalkUserDetailResponse
     */
    DingTalkUserDetail getUserDetailByCode(String agentId, String userId);

    /**
     * DingTalk Application -- get the sub department ID list
     *
     * @param agentId Applied agentId
     * @param deptId The parent Department ID is passed to 1 at the root.
     * @return Sub Department ID List
     */
    List<Long> getDepartmentSubIdList(String agentId, Long deptId);

    /**
     * Get the list of all members of the department
     *
     * @param agentId Applied agentId
     * @param deptId Department ID
     * @param cursor Cursor for paged queries
     * @param size Page size
     * @return List<UserDetail>
     */
    UserPageResult getUserDetailList(String agentId, Long deptId, Integer cursor, Integer size);

    /**
     * Get all user information under the root door of the current application
     *
     * @param agentId Applied agentId
     * @param cursor Cursor for paged queries
     * @param size Page size
     * @return UserPageResult
     */
    UserPageResult getRootUserDetailList(String agentId, Integer cursor, Integer size);

    /**
     * Get department list
     *
     * @param agentId Applied agentId
     * @param deptId Department ID
     * @return List<DeptBaseResponse>
     */
    List<DingTalkDeptBaseInfo> getDepartmentSubList(String agentId, Long deptId);

    /**
     * Register the Ding Talk callback event url
     *
     * @param agentId Applied agentId
     * @param url Callback url
     * @param events Callback Events
     */
    void registerCallbackUrl(String agentId, String url, List<String> events);

    /**
     * Delete DingTalk callback event url
     *
     * @param agentId Applied agentId
     */
    void deleteCallbackUrl(String agentId);

    /**
     * Send card message to DingTalk user -- work notice form
     *
     * @param agentId Applied agentId
     * @param message Message content
     * @param tenantUserIds DingTalk User ID
     * @return Asynchronous task ID
     */
    List<String> asyncSendCardMessageToUserPrivate(String agentId, Message message, List<String> tenantUserIds);

    /**
     * Get the agent ID according to the appid and the third-party company ID
     *
     * @param appId Application unique identification
     * @param tenantId Unique identification of the third integration platform
     * @return Applied agentId
     */
    String getAgentIdByAppIdAndTenantId(String appId, String tenantId);

    /**
     * Get department details
     *
     * @param agentId Application unique identification
     * @param deptId DingTalkDepartment ID
     * @return DingTalkDeptDetail
     */
    DingTalkDeptDetail getDeptDetail(String agentId, Long deptId);

    /**
     * Get department details
     *
     * @param agentId Application unique identification
     * @param deptId DingTalkDepartment ID
     * @param languageType Return message language
     * @return DingTalkDeptDetail
     */
    DingTalkDeptDetail getDeptDetail(String agentId, Long deptId, DingTalkLanguageType languageType);

    /**
     * Get the list of department user IDs
     *
     * @param agentId Application unique identification
     * @param deptId DingTalkDepartment ID
     * @return Department User ID List
     */
    List<String> getDeptUserIdList(String agentId, Long deptId);

    /**
     * Get Enterprise authorization information
     *
     * @param agentId Application unique identification
     * @return Enterprise authorization information
     */
    DingTalkServerAuthInfoResponse getServerAuthInfo(String agentId);

    /**
     * Obtain the authorized enterprise ID according to the application ID
     *
     * @param agentId Application unique identification
     * @return Authorized enterprise ID
     */
    String getTenantIdByAgentId(String agentId);

    /**
     * Get the visible range of the application
     *
     * @param agentId Authorization application agent ID
     * @return Enterprise authorization information
     */
    DingTalkAppVisibleScopeResponse getAppVisibleScopes(String agentId);

    /**
     * Get the user's parent department list
     *
     * @param agentId Authorization application agent ID
     * @param userId DingTalk Application user ID
     * @return DingTalkUserParentDeptList
     */
    DingTalkUserParentDeptList getUserParentDeptList(String agentId, String userId);

    /**
     * Get the number of people in the application visible range
     *
     * @param agentId Authorization application agent ID
     * @return Number of people
     */
    Integer getAppVisibleUserCount(String agentId);

    /**
     * Get a list of all the parent departments of the specified department, including your own
     *
     * @param agentId agentId
     * @param deptId Department ID
     * @return List of all parent Department IDs of the department
     */
    List<Long> getDeptParentIdList(String agentId, Long deptId);

    /**
     *  Third party website login: obtain user information through temporary authorization code
     *
     * @param tmpAuthCode Temporary authorization code
     * @return UserInfo
     */
    UserInfo getUserInfoByCode(String tmpAuthCode);

    /**
     * Obtaining user information through non login code (v 2)
     *
     * @param code Registration free authorization code
     * @return UserInfoV2
     */
    UserInfoV2 getUserInfoV2ByCode(String code);

    /**
     * Obtain user details according to userid
     *
     * @param userId Employee's unique ID userid
     * @return DingTalkUserDetailResponse
     */
    DingTalkUserDetail getUserInfoByUserId(String userId);

    /**
     * Get the configuration information of agent app according to agent ID
     *
     * @param agentId agentId
     * @return AgentApp
     */
    AgentApp getAgentAppById(String agentId);

    /**
     * Get the ID of vika's Ding alk display configuration
     *
     * @return string
     */
    String getVikaDingAppId();

    /**
     *  Get DingTalk configuration
     *
     * @return DingTalk Config
     */
    DingtalkConfig getDingTalkConfig();

    /**
     * Get the callback address of the Ding Talk event
     *
     * @param agentId agentId
     * @return token url
     */
    String getDingTalkEventCallbackUrl(String agentId);

    /**
     * Get the list of all members of the department
     *
     * @param agentId Applied agentId
     * @param deptId Department ID
     * @return List<UserDetail>
     */
    List<DingTalkUserDetail> getDeptAllUserDetailList(String agentId, Long deptId);

    /**
     * Get the map of all department members
     *
     * @param agentId Applied agentId
     * @param deptId Department Id
     * @return Map<String, DingTalkUserDetail>
     */
    Map<String, DingTalkUserDTO> getUserDetailMap(String agentId, Long deptId);

    /**
     * Get all self departments and all user maps under a given department
     *
     * @param agentId Applied agentId
     * @param deptId Department ID
     * @param userDeptMap User department map
     * @return Map<String, DingTalkUserDetail>
     */
    LinkedHashMap<Long, DingTalkContactDTO> getUserDetailSubTreeMapByDeptId(String agentId, Long deptId, LinkedHashMap<Long, DingTalkContactDTO> userDeptMap);

    /**
     * Get all self departments and all user maps under a given department
     *
     * @param agentId Applied agentId
     * @param deptIds Department ID List
     * @return Map<Long, Map < String, DingTalkUserDetailDTO>>
     */
    LinkedHashMap<Long, DingTalkContactDTO> getContactSubTreeMapByDeptIds(String agentId, List<Long> deptIds);

    /**
     * Get the address list according to the Department ID
     *
     * @param agentId Applied agentId
     * @param deptIds Department ID List
     * @return Map<Long, Map < String, DingTalkUserDetailDTO>>
     */
    LinkedHashMap<Long, DingTalkContactDTO> getContactTreeMapByDeptIds(String agentId, List<Long> deptIds);

    /**
     * Get the address list according to the Department ID
     *
     * @param agentId Applied agentId
     * @param openIds User's open ID list
     * @return Map<Long, Map < String, DingTalkUserDetailDTO>>
     */
    LinkedHashMap<Long, DingTalkContactDTO> getContactTreeMapByOpenIds(String agentId, List<String> openIds, LinkedHashMap<Long, DingTalkContactDTO> contactMap);

    /**
     * Get the address list according to the Department ID
     *
     * @param agentId Applied agentId
     * @return LinkedHashMap<Long, DingTalkContactDTO> DingTalk Department member information
     */
    LinkedHashMap<Long, DingTalkContactDTO> getContactTreeMap(String agentId);

    /**
     * Build department basic data
     *
     * @param baseInfo Department Basic Information
     * @return DingTalkDepartmentDTO
     */
    DingTalkDepartmentDTO formatDingTalkDepartmentDto(DingTalkDeptBaseInfo baseInfo);
}
