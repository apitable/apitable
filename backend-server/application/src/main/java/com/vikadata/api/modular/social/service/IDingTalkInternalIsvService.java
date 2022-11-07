package com.vikadata.api.modular.social.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.apitable.starter.social.dingtalk.autoconfigure.DingTalkProperties.IsvAppProperty;
import com.vikadata.integration.grpc.CorpBizDataDto;
import com.vikadata.integration.grpc.DingTalkUserDto;
import com.vikadata.integration.grpc.TenantInfoResult;
import com.vikadata.social.dingtalk.enums.DingTalkBizType;
import com.vikadata.social.dingtalk.enums.DingTalkMediaType;
import com.vikadata.social.dingtalk.model.DingTalkAsyncSendCorpMessageResponse;
import com.vikadata.social.dingtalk.model.DingTalkCreateApaasAppRequest;
import com.vikadata.social.dingtalk.model.DingTalkCreateApaasAppResponse;
import com.vikadata.social.dingtalk.model.DingTalkInternalOrderResponse.InAppGoodsOrderVo;
import com.vikadata.social.dingtalk.model.DingTalkSsoUserInfoResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserDetail;
import com.vikadata.social.dingtalk.model.DingTalkUserListResponse.UserPageResult;
import com.vikadata.social.dingtalk.model.UserInfoV2;

/**
 * <p>
 * DingTalk Integration service interface
 * </p>
 */
public interface IDingTalkInternalIsvService {
    /**
     * Obtain user information according to temporary authorization code
     *
     * @param suiteId Suit ID
     * @param authCorpId CorpId of authorized enterprises
     * @param code Temporary authorization code
     * @return UserInfoV2
     */
    UserInfoV2 getUserInfoByCode(String suiteId, String authCorpId, String code);

    /**
     * Obtain user details according to temporary authorization code
     *
     * @param suiteId Suit ID
     * @param code Authenticate to the code on the URL through Oauth
     * @return DingTalkUserDetailResponse
     */
    DingTalkSsoUserInfoResponse getSsoUserInfoByCode(String suiteId, String code);

    /**
     * Obtain user details according to temporary authorization code
     *
     * @param suiteId Suit ID
     * @param userId DingTalk Application UserId
     * @param authCorpId Corpid of authorized enterprises
     * @return DingTalkUserDetailResponse
     */
    DingTalkUserDetail getUserDetailByCode(String suiteId, String authCorpId, String userId);

    /**
     * Obtain user details according to userid
     *
     * @param suiteId Suit ID
     * @param authCorpId CorpId of authorized enterprises
     * @param userId User's userid
     * @return DingTalkUserDetailResponse
     */
    DingTalkUserDetail getUserDetailByUserId(String suiteId, String authCorpId, String userId);

    /**
     * Obtain user details according to userid
     *
     * @param suiteId Suit ID
     * @param authCorpId CorpId of authorized enterprises
     * @param userId User's userid
     * @return DingTalkUserDetailResponse
     */
    DingTalkUserDto getIsvUserDetailByUserId(String suiteId, String authCorpId, String userId);

    /**
     * Check whether the authorized enterprise is authorized
     *
     * @param suiteId Suit ID
     * @param authCorpId CorpId of authorized enterprises
     * @return Whether authorized
     */
    Boolean getSocialTenantStatus(String suiteId, String authCorpId);

    /**
     * DingTalkISV Application -- get the sub ID list of the department
     *
     * @param suiteId The suite Id of the application
     * @param authCorpId Authorized enterprise corpId
     * @param deptId The parent department ID is passed to 1 from the root door.
     * @return Sub department ID list
     */
    List<Long> getDepartmentSubIdList(String suiteId, String authCorpId, Long deptId);

    /**
     * Get the list of all members of the department
     *
     * @param suiteId The suite Id of the application
     * @param authCorpId Authorized enterprise ID
     * @param deptId Department ID
     * @param cursor Cursor for paged queries
     * @param size Page size
     * @return List<UserDetail>
     */
    UserPageResult getDeptUserDetailList(String suiteId, String authCorpId, Long deptId, Integer cursor, Integer size);

    /**
     * Obtain the user information list of authorized enterprises
     *
     * @param suiteId Suit ID
     * @param authCorpId CorpId of authorized enterprises
     * @param authDeptIds Department ID of the visible range
     * @param authUserIds Ding Talk user ID of the visible range
     * @return DingTalk User Details List
     */
    HashMap<String, DingTalkUserDto> getAuthCorpUserDetailMap(String suiteId, String authCorpId, List<String> authDeptIds,
            List<String> authUserIds);

    /**
     * Obtain the user information of the authorized enterprise through the visible user ID
     *
     * @param suiteId Suit ID
     * @param authCorpId CorpId of authorized enterprises
     * @param userIds User ID of the visible range
     * @return DingTalk User Details List
     */
    Map<String, DingTalkUserDto> getAuthCorpUserDetailListByUserIds(String suiteId, String authCorpId,
            List<String> userIds);

    /**
     * Use templates to send work notification messages
     *
     * @param suiteId App suite Id
     * @param authCorpId The corp ID of the authorized enterprise
     * @param templateId Message template ID
     * @param data The dynamic parameter assignment data of the message template indicates that both key and value are in string format.
     * @param userIds DingTalk The maximum length of user ID is 100
     * @return ID of the asynchronous sending task created
     */
    List<DingTalkAsyncSendCorpMessageResponse> sendMessageToUserByTemplateId(String suiteId, String authCorpId,
            String templateId, HashMap<String, String> data, List<String> userIds);

    /**
     * Use templates to send work notification messages
     *
     * @param suiteId App suite Id
     * @param authCorpId The corp ID of the authorized enterprise
     * @param templateId Message template ID
     * @param data The dynamic parameter assignment data of the message template indicates that both key and value are in string format.
     * @param userIds DingTalk The maximum length of user ID is 100
     * @param agentId Applied agent Id
     * @return ID of the asynchronous sending task created
     */
    List<DingTalkAsyncSendCorpMessageResponse> sendMessageToUserByTemplateId(String suiteId, String authCorpId,
            String templateId, HashMap<String, String> data, List<String> userIds, String agentId);

    /**
     * Get third-party enterprise application configuration information
     *
     * @param suiteId App suite Id
     * @return IsvApp
     */
    IsvAppProperty getIsvAppConfig(String suiteId);

    /**
     * Get third-party enterprise application configuration information
     *
     * @param dingDingDaKey DingTalk key
     * @return IsvApp
     */
    IsvAppProperty getIsvAppConfigByDingDingDaKey(String dingDingDaKey);

    /**
     * Upload media files
     *
     * @param suiteId App suite Id
     * @param authCorpId Authorized enterprise
     * @param mediaType Type
     * @param file File
     * @param fileName Document name
     * @return DingTalkMediaCreateResponse
     */
    String uploadMedia(String suiteId, String authCorpId, DingTalkMediaType mediaType, byte[] file, String fileName);

    /**
     * Create an apaas application
     * @param suiteId App suite Id
     * @param authCorpId Authorized enterprise
     * @param request Request parameters
     * @return DingTalkCreateApaasAppResponse
     */
    DingTalkCreateApaasAppResponse createMicroApaasApp(String suiteId, String authCorpId, DingTalkCreateApaasAppRequest request);

    /**
     * Check authorized enterprises
     *
     * @param suiteId Suit ID
     * @param authCorpId CorpId of authorized enterprises
     * @return TenantInfoResult
     */
    TenantInfoResult getSocialTenantInfo(String authCorpId, String suiteId);

    /**
     * Get the SKU page address of domestic products
     *
     * @param suiteId App suite Id
     * @param authCorpId Authorized enterprise
     * @param callbackPage Callback page (URL Encoding), micro application is the page URL, and E application is the page path address.
     * @param extendParam Parameter
     * @return DingTalkSkuPageResponse
     */
    String getInternalSkuPage(String suiteId, String authCorpId, String callbackPage,
            String extendParam);

    /**
     * Processing of domestic purchase order completed
     * Call this interface to complete the processing of domestic purchase order
     *
     * @param suiteId App suite Id
     * @param authCorpId Authorized enterprise
     * @param orderId Internal purchase orderId
     * @return Boolean
     */
    Boolean internalOrderFinish(String suiteId, String authCorpId, String orderId);

    /**
     * Get the internal purchase order information
     *
     * @param suiteId App suite Id
     * @param authCorpId Authorized enterprise
     * @param orderId Internal purchase orderId
     * @return DingTalkInternalOrderResponse
     */
    InAppGoodsOrderVo getInternalOrder(String suiteId, String authCorpId, String orderId);

    /**
     * js api dd.config Signature generation
     *
     * @param suiteId Suit ID
     * @param authCorpId CorpId of authorized enterprises
     * @param nonceStr Random string
     * @param timestamp Time stamp
     * @param url Current interface link
     * @return String
     */
    String ddConfigSign(String suiteId, String authCorpId, String nonceStr, String timestamp, String url);

    /**
     * Get the agent ID of the third-party enterprise application
     *
     * @param suiteId Suit ID
     * @param authCorpId CorpId of authorized enterprises
     * @return agentId
     */
    String getIsvDingTalkAgentId(String suiteId, String authCorpId);

    /**
     * Get the number of employees
     *
     * @param suiteId App suite Id
     * @param authCorpId Authorized enterprise
     * @param onlyActive Include the number of inactive Ding Talk people: false: Include the number of inactive Ding Talk people. True: Only the number of people who activate Ding Talk is included.
     * @return Number of employees
     */
    Integer getUserCount(String suiteId, String authCorpId, Boolean onlyActive);

    /**
     * Get the number of employees
     *
     * @param suiteId App suite Id
     * @param authCorpId Authorized enterprise
     * @param deptIds Department ID
     * @return Number of employees
     */
    Integer getUserCountByDeptIds(String suiteId, String authCorpId, List<String> deptIds);

    /**
     * Get the number of employees
     *
     * @param suiteId App suite Id
     * @param authCorpId Authorized enterprise
     * @param deptIds Department ID
     * @param userIds User ID
     * @return DingTalkDepartmentUserIdListResponse
     */
    Integer getUserCountByDeptIdsAndUserIds(String suiteId, String authCorpId, List<String> deptIds,
            List<String> userIds);

    /**
     * Recursive department to query all user information
     *
     * @param suiteId App suite Id
     * @param authCorpId Authorized enterprise
     * @param subDeptIds Department ID List
     */
    Map<String, DingTalkUserDto> getUserTreeList(String suiteId, String authCorpId, List<String> subDeptIds);

    /**
     * Obtain event information of the enterprise
     *
     * @param suiteId App suite Id
     * @param authCorpId Authorized enterprise
     * @param bizTypes Event Type
     * @return List<CorpBizDataDto>
     */
    List<CorpBizDataDto> getCorpBizDataByBizTypes(String suiteId, String authCorpId, List<DingTalkBizType> bizTypes);
}
