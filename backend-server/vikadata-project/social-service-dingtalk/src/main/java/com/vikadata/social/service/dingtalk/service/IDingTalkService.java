package com.vikadata.social.service.dingtalk.service;

import java.io.File;
import java.util.HashMap;
import java.util.List;

import com.vikadata.integration.grpc.DingTalkUserDto;
import com.vikadata.social.dingtalk.DingtalkConfig.IsvApp;
import com.vikadata.social.dingtalk.enums.DingTalkMediaType;
import com.vikadata.social.dingtalk.model.BaseResponse;
import com.vikadata.social.dingtalk.model.DingTalkAsyncSendCorpMessageResponse;
import com.vikadata.social.dingtalk.model.DingTalkCreateApaasAppRequest;
import com.vikadata.social.dingtalk.model.DingTalkCreateApaasAppResponse;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentSubIdListResponse;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentUserIdListResponse;
import com.vikadata.social.dingtalk.model.DingTalkInternalOrderResponse;
import com.vikadata.social.dingtalk.model.DingTalkMediaUploadResponse;
import com.vikadata.social.dingtalk.model.DingTalkServerAuthInfoResponse;
import com.vikadata.social.dingtalk.model.DingTalkSkuPageResponse;
import com.vikadata.social.dingtalk.model.DingTalkSsoUserInfoResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserDetailResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserInfoV2Response;
import com.vikadata.social.dingtalk.model.DingTalkUserListResponse;

/**
 * DingTalk api interface
 */
public interface IDingTalkService {
    /**
     * get isv app config
     * @param suiteId suite Id
     * @return IsvApp
     *
     */
    IsvApp getIsvAppConfig(String suiteId);

    /**
     * Force refresh token
     *
     * @param suiteId App's suite Id
     * @param authCorpId authorized enterprise id
     */
    void refreshAccessToken(String suiteId, String authCorpId);

    /**
     * Get a list of all members of the department
     *
     * @param suiteId App's suite Id
     * @param authCorpId authorized enterprise id
     * @param deptId department id
     * @param cursor cursor for paging queries
     * @param size paging size
     * @return List<UserDetail>
     */
    DingTalkUserListResponse getUserDetailList(String suiteId, String authCorpId, Long deptId, Integer cursor, Integer size);

    /**
     * DingTalk ISV Application--Get a list of department sub-IDs
     *
     * @param suiteId App's suite Id
     * @param authCorpId authorized enterprise id
     * @param deptId Parent department ID, pass 1 for the root department.
     * @return sub department id list
     */
    DingTalkDepartmentSubIdListResponse getDepartmentSubIdList(String suiteId, String authCorpId, Long deptId);

    /**
     * get user details based on userid
     *
     * @param suiteId App's suite Id
     * @param authCorpId authorized enterprise id
     * @param userId userid of the user
     * @return DingTalkUserDetailResponse
     */
    DingTalkUserDetailResponse getUserDetailByUserId(String suiteId, String authCorpId, String userId);

    /**
     * activate the app.
     * After receiving the enterprise authorized application activation event pushed by the HTTP callback, call this
     * API to activate the enterprise authorized application.
     *
     * @param suiteId App's suite Id
     * @param authCorpId authorized enterprise id
     * @param permanentCode Permanent authorization code of authorized enterprise
     * @return The access token of the third-party application authorization enterprise
     */
    Boolean activeSuite(String suiteId, String authCorpId, String permanentCode);

    /**
     * obtain enterprise authorization information.
     * Third-party enterprise applications and customized service providers call this API to obtain enterprise
     * authorization information when developing internal enterprise applications for enterprises.
     *
     * @param suiteId App's suite Id
     * @param authCorpId authorized enterprise id
     * @return enterprise authorization information
     */
    DingTalkServerAuthInfoResponse getAuthCorpInfo(String suiteId, String authCorpId);

    /**
     * Obtain user information based on temporary authorization code
     *
     * @param suiteId App's suite Id
     * @param authCorpId authorized enterprise id
     * @param code temporary authorization code
     * @return UserInfoV2
     */
    DingTalkUserInfoV2Response getUserInfoByCode(String suiteId, String authCorpId, String code);

    /**
     * Obtain background administrator identity information and user information according to the temporary authorization code
     *
     * @param suiteId App's suite Id
     * @param code temporary authorization code
     * @return UserInfoV2
     */
    DingTalkSsoUserInfoResponse getSsoUserInfoByCode(String suiteId, String code);

    /**
     * send job notification messages using templates
     *
     * @param suiteId App's suite Id
     * @param authCorpId authorized enterprise id
     * @param agentId Third-party enterprise applications can call the interface to obtain enterprise authorization
     * information to obtain
     * @param templateId message template id
     * @param data Message template dynamic parameter assignment data, indicating that both key and value are in string format.
     * @param userIds The maximum length of DingTalk user ID is 100
     * @return Created asynchronous send task ID
     */
    DingTalkAsyncSendCorpMessageResponse sendMessageToUserByTemplateId(String suiteId, String authCorpId, String agentId,
            String templateId, String data, List<String> userIds);

    /**
     * Upload media files
     *
     * @param suiteId App's suite Id
     * @param authCorpId authorized enterprise id
     * @param mediaType type
     * @param file file
     * @return DingTalkMediaCreateResponse
     */
    DingTalkMediaUploadResponse uploadMedia(String suiteId, String authCorpId, DingTalkMediaType mediaType, File file);

    /**
     * Create apaas application
     * @param suiteId App's suite Id
     * @param authCorpId authorized enterprise id
     * @param request request parameters
     * @return DingTalkCreateApaasAppResponse
     */
    DingTalkCreateApaasAppResponse createMicroApaasApp(String suiteId, String authCorpId, DingTalkCreateApaasAppRequest request);

    /**
     * Get the SKU page address of in-app purchase products
     * @param suiteId App's suite Id
     * @param authCorpId authorized enterprise id
     * @param goodsCode product code
     * @param callbackPage Callback page (for URLEncode processing), the micro application is the page URL, and the E
     * application is the page path address.
     * @param extendParam parameter
     * @return DingTalkSkuPageResponse
     */
    DingTalkSkuPageResponse getInternalSkuPage(String suiteId, String authCorpId, String goodsCode, String callbackPage,
            String extendParam);

    /**
     * in app purchase order processing completed.
     * Call this API to complete in-app purchase order processing.
     * @param suiteId App's suite Id
     * @param authCorpId authorized enterprise id
     * @param orderId in app purchase order number
     * @return BaseResponse
     */
    BaseResponse internalOrderFinish(String suiteId, String authCorpId, String orderId);

    /**
     * Get in-app purchase order information
     *
     * @param suiteId App's suite Id
     * @param authCorpId authorized enterprise id
     * @param orderId in app purchase order number
     * @return DingTalkInternalOrderResponse
     */
    DingTalkInternalOrderResponse getInternalOrder(String suiteId, String authCorpId, String orderId);


    /**
     * js api dd.config signature generation
     *
     * @param suiteId App's suite Id
     * @param authCorpId authorized enterprise id
     * @param nonceStr random string
     * @param timestamp timestamp
     * @param url current page link
     * @return String
     */
    String ddConfigSign(String suiteId, String authCorpId, String nonceStr, String timestamp, String url);

    /**
     * get the number of employees
     *
     * @param suiteId App's suite Id
     * @param authCorpId authorized enterprise id
     * @param onlyActive Whether to include the number of people who have not activated DingTalk: false: Include the
     * number of people who have not activated DingTalk. true: Only include the number of people who activated DingTalk.
     * @return number of workers
     */
    Integer getUserCount(String suiteId, String authCorpId, Boolean onlyActive);

    /**
     * Get department user ID
     *
     * @param suiteId App's suite Id
     * @param authCorpId authorized enterprise id
     * @param deptId department id
     * @return DingTalkDepartmentUserIdListResponse
     */
    DingTalkDepartmentUserIdListResponse getUserIdListByDeptId(String suiteId, String authCorpId, Long deptId);

    /**
     * Recursively given department, query all user information
     *
     * @param suiteId App's suite Id
     * @param authCorpId authorized enterprise id
     * @param subDeptIds department id list
     * @param userMap Accept result set
     */
    void getUserTreeList(String suiteId, String authCorpId, List<String> subDeptIds,
            HashMap<String, DingTalkUserDto> userMap);

    /**
     * Get all user information of the department
     *
     * @param suiteId App's suite Id
     * @param authCorpId authorized enterprise id
     * @param deptId Department ID
     * @return HashMap<String, DingTalkUserDto>
     */
    HashMap<String, DingTalkUserDto> getDeptUserDetailMap(String suiteId, String authCorpId, Long deptId);
}
