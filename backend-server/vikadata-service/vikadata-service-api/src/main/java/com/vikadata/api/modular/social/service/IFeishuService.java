package com.vikadata.api.modular.social.service;

import java.util.List;
import java.util.Map;

import com.vikadata.api.modular.social.model.FeishuTenantInfoVO;
import com.vikadata.social.feishu.FeishuEventListenerManager;
import com.vikadata.social.feishu.card.Message;
import com.vikadata.social.feishu.config.FeishuConfigStorage;
import com.vikadata.social.feishu.event.FeishuEventParser;
import com.vikadata.social.feishu.event.v3.FeishuV3ContactEventParser;
import com.vikadata.social.feishu.model.BatchSendChatMessageResult;
import com.vikadata.social.feishu.model.FeishuAccessToken;
import com.vikadata.social.feishu.model.FeishuAdminUserList;
import com.vikadata.social.feishu.model.FeishuContactScope;
import com.vikadata.social.feishu.model.FeishuDepartmentDetail;
import com.vikadata.social.feishu.model.FeishuDepartmentInfo;
import com.vikadata.social.feishu.model.FeishuPassportAccessToken;
import com.vikadata.social.feishu.model.FeishuPassportUserInfo;
import com.vikadata.social.feishu.model.FeishuTenantInfo;
import com.vikadata.social.feishu.model.FeishuUserDetail;
import com.vikadata.social.feishu.model.v3.FeishuDeptObject;
import com.vikadata.social.feishu.model.v3.FeishuUserObject;
import com.vikadata.social.feishu.model.v3.FeishuV3DeptsPager;
import com.vikadata.social.feishu.model.v3.FeishuV3UsersPager;

/**
 * Lark Integration Service Interface
 */
public interface IFeishuService {

    /**
     * Default Store App
     *
     * @return true | false
     */
    boolean isDefaultIsv();

    /**
     * Get Isv Store App ID
     *
     * @return AppId
     */
    String getIsvAppId();

    /**
     * Switch the store application context. Preconditions of all the following interfaces
     */
    void switchDefaultContext();

    /**
     * Switch the application. If it does not exist, set the value
     *
     * @param configStorage Configure Storage
     */
    void switchContextIfAbsent(FeishuConfigStorage configStorage);

    /**
     * Event content
     *
     * @param eventData Event content
     * @return Map<String, Object>
     */
    Map<String, Object> decryptData(String eventData);

    /**
     * Verify application event token
     *
     * @param jsonData Json data structure
     */
    void checkVerificationToken(Map<String, Object> jsonData);

    /**
     * Get Event Parser
     *
     * @return FeishuEventParser
     */
    FeishuEventParser getEventParser();

    /**
     * Get the v3 address book event parser
     *
     * @return FeishuV3ContactEventParser
     */
    FeishuV3ContactEventParser getV3EventParser();

    /**
     * Get Event Listener
     *
     * @return FeishuEventListenerManager
     */
    FeishuEventListenerManager getEventListenerManager();

    /**
     * Construct authorization callback address
     *
     * @param redirectUri Redirect Address
     * @param state Custom Value
     * @return token url
     */
    String buildAuthUrl(String redirectUri, String state);

    /**
     * Obtain user credential information
     *
     * @param code Temporary authorization code
     * @return FeishuAccessToken
     */
    FeishuAccessToken getUserAccessToken(String code);

    /**
     * General ability to obtain access token
     *
     * @param code Temporary authorization code
     * @param redirectUri token url
     * @return FeishuPassportAccessToken
     */
    FeishuPassportAccessToken getPassportAccessToken(String code, String redirectUri);

    /**
     * General ability to obtain user identity information
     *
     * @param accessToken Access Token
     * @return FeishuPassportUserInfo
     */
    FeishuPassportUserInfo getPassportUserInfo(String accessToken);

    /**
     *  Obtain Lark Tenant enterprise information
     *
     * @param tenantKey Enterprise ID
     * @return FeishuTenantInfo
     */
    FeishuTenantInfo getFeishuTenantInfo(String tenantKey);

    /**
     * Batch send messages to specified users
     * Private chat information
     *
     * @param tenantKey Enterprise ID
     * @param openIds   Third party user ID, sending user
     * @param message   NEWS
     * @return BatchSendChatMessageResult
     */
    BatchSendChatMessageResult batchSendCardMessage(String tenantKey, List<String> openIds, Message message);

    /**
     * Send message to group chat group
     *
     * @param tenantKey Enterprise ID
     * @param chatId    Group chat ID
     * @param message   NEWS
     * @return Message Id
     */
    String sendCardMessageToChatGroup(String tenantKey, String chatId, Message message);

    /**
     * Send private chat message
     *
     * @param tenantKey Enterprise ID
     * @param openId    User OPEN ID
     * @param message   NEWS
     * @return Message Id
     */
    String sendCardMessageToUserPrivate(String tenantKey, String openId, Message message);

    /**
     * Obtain the uniform ID of Lark user
     *
     * @param tenantKey Tenant ID
     * @param openId    Lark User ID
     * @return Unified ID
     */
    String getUnionIdByOpenId(String tenantKey, String openId);

    /**
     * Get the open ID according to the union ID
     *
     * @param tenantKey Tenant ID
     * @param unionId  Lark user unified ID
     * @return User open Id
     */
    String getOpenIdByUnionId(String tenantKey, String unionId);

    /**
     * Get the administrator list of the enterprise
     *
     * @param tenantKey Tenant ID
     * @return FeishuAdminUserList
     */
    FeishuAdminUserList getAdminList(String tenantKey);

    /**
     * Get the enterprise administrator Open ID list
     *
     * @param tenantKey Tenant ID
     * @return Administrator ID
     */
    List<String> getAdminOpenIds(String tenantKey);

    /**
     * NEW EDITION
     * Get single user information
     *
     * @param tenantKey Tenant ID
     * @param openId    Lark User ID
     * @return FeishuUserObject
     */
    FeishuUserObject getTenantUserInfo(String tenantKey, String openId);

    /**
     * Get Lark user information
     *
     * @param tenantKey Tenant ID
     * @param openId    Lark User ID
     * @return Lark user information
     */
    FeishuUserDetail getSingleUserDetail(String tenantKey, String openId);

    /**
     * Get Lark user information in batch
     *
     * @param tenantKey Tenant ID
     * @param openIds   Lark User ID set
     * @return Lark User Information List
     */
    List<FeishuUserDetail> batchGetUserDetail(String tenantKey, List<String> openIds);

    /**
     * Administrator who verifies whether Lark user is applied
     *
     * @param tenantKey Tenant ID
     * @param openId    Lark User ID
     * @return True ｜ False
     */
    boolean checkUserIsAdmin(String tenantKey, String openId);

    /**
     * Get the address book range of Lark enterprise authorized applications
     *
     * @param tenantKey Tenant ID
     * @return FeishuContactScope
     */
    FeishuContactScope getFeishuTenantContactAuthScope(String tenantKey);

    /**
     * Total number of employees in the address book range authorized by Lark Enterprise
     *
     * @param tenantKey Tenant ID
     * @param filterInactive Filter inactive employees
     * @return Total number of employees in the address book range authorized by the enterprise
     */
    int getFeishuTenantContactScopeEmployeeCount(String tenantKey, boolean filterInactive);

    /**
     * Get Lark Enterprise Information
     * Customize Result View
     *
     * @param tenantKey Tenant ID
     * @return FeishuTenantInfoVO Enterprise information
     */
    FeishuTenantInfoVO getTenantInfo(String tenantKey);

    /**
     * Get department details
     *
     * @param tenantKey        Enterprise ID
     * @param departmentId     Customized ID of enterprise department
     * @param openDepartmentId Enterprise department open ID
     * @return FeishuDepartmentDetail
     */
    FeishuDepartmentDetail getDepartmentDetail(String tenantKey, String departmentId, String openDepartmentId);

    /**
     * Get department details in batch
     *
     * @param tenantKey     Enterprise ID
     * @param departmentIds List of custom IDs for enterprise departments
     * @return FeishuDepartmentDetail Department information
     */
    List<FeishuDepartmentDetail> batchGetDepartmentDetail(String tenantKey, List<String> departmentIds);

    /**
     * Get the list of all sub departments under the department
     *
     * @param tenantKey     Enterprise ID
     * @param departmentIds List of custom IDs for enterprise departments
     * @return List of all sub departments
     */
    List<FeishuDepartmentInfo> getAllSubDepartments(String tenantKey, List<String> departmentIds);

    /**
     * Get the list of sub departments of the department
     * This interface can know the order of sub departments
     *
     * @param tenantKey    Enterprise ID
     * @param departmentId Department ID
     * @param fetchChild   Recursive Query
     * @return FeishuDepartmentInfo Department information
     */
    List<FeishuDepartmentInfo> getDeptListByParentDept(String tenantKey, String departmentId, int pageSize, boolean fetchChild);

    /**
     * Obtain the user information under the department
     *
     * @param tenantKey    Enterprise ID
     * @param departmentId Department ID
     * @param pageSize  Paging Size
     * @param fetchChild   Recursively query all employees
     * @return FeishuUserDetail Department user information
     */
    List<FeishuUserDetail> getUserListByDept(String tenantKey, String departmentId, int pageSize, boolean fetchChild);

    /**
     * Query single department information
     *
     * @param tenantKey Tenant
     * @param departmentId Department ID
     * @param openDepartmentId Department OpenID
     * @return FeishuDeptObject
     */
    FeishuDeptObject getDept(String tenantKey, String departmentId, String openDepartmentId);

    /**
     * Pagination query of sub department list
     *
     * @param tenantKey Tenant
     * @param parentDepartmentId Parent Department OpenID
     * @return FeishuV3DeptsPager
     */
    FeishuV3DeptsPager getDeptPager(String tenantKey, String parentDepartmentId);

    /**
     * Pagination query of sub department list
     *
     * @param tenantKey Tenant
     * @param parentOpenDepartmentId Parent Department OpenID
     * @return FeishuV3DeptsPager
     */
    FeishuV3DeptsPager getDeptPagerByOpenDepartmentId(String tenantKey, String parentOpenDepartmentId);

    /**
     * Query single user information
     *
     * @param tenantKey Tenant
     * @param openId User open Id
     * @return FeishuUserObject
     */
    FeishuUserObject getUser(String tenantKey, String openId);

    /**
     * Query department user list by page
     *
     * @param tenantKey Tenant
     * @param departmentId Department ID
     * @return FeishuV3UsersPager
     */
    FeishuV3UsersPager getUserPager(String tenantKey, String departmentId);

    /**
     * Query department user list by page
     * @param tenantKey Tenant
     * @param openDepartmentId Department OpenID
     * @return FeishuV3UsersPager
     */
    FeishuV3UsersPager getUserPagerByOpenDeptId(String tenantKey, String openDepartmentId);
}
