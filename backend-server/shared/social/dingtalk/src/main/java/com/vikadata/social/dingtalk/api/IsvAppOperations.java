package com.vikadata.social.dingtalk.api;

import java.io.File;
import java.util.List;

import com.vikadata.social.dingtalk.enums.DingTalkLanguageType;
import com.vikadata.social.dingtalk.enums.DingTalkMediaType;
import com.vikadata.social.dingtalk.enums.DingTalkOrderField;
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
 * Third-party application interface--on the application market
 */
public interface IsvAppOperations {
    /**
     * Obtain an access token for authorizing enterprise applications
     *
     * @param forceRefresh Force refresh
     * @param suiteId suite id
     * @param authCorpId The corpid of the authorized enterprise
     * @return The access token of the isv app for authorization enterprise
     */
    String getAccessToken(String suiteId, String authCorpId, boolean forceRefresh);

    /**
     * Obtain the suite_access_token of the ISV application. The suite_access_token is mainly used
     * to obtain the information of the third-party enterprise application
     *
     * @param suiteId suite id
     * @param forceRefresh Force refresh
     * @return authorization enterprise access_token
     */
    String getSuiteAccessToken(String suiteId, boolean forceRefresh);

    /**
     * Get jsapiticket
     *
     * @param suiteId suite id
     * @param authCorpId The corpid of the authorized enterprise
     * @param forceRefresh Force refresh
     * @return String
     */
    String getJsApiTicket(String suiteId, String authCorpId, boolean forceRefresh);

    /**
     * js api dd.config signature generation
     *
     * @param suiteId suite id
     * @param authCorpId The corpid of the authorized enterprise
     * @param nonceStr random string
     * @param timestamp timestamp millisecond
     * @param url current page link
     * @return String
     */
    String ddConfigSign(String suiteId, String authCorpId, String nonceStr, String timestamp, String url);

    /**
     * get isv app admin management password-free login access_token
     * @param suiteId suiteId
     * @return isv app admin management  password-free login access_token
     */
    String getSsoAccessToken(String suiteId);

    /**
     * Obtain enterprise authorization information
     * When third-party enterprise applications and customized service providers develop internal enterprise applications for enterprises,
     * call this API to obtain enterprise authorization information。
     *
     * @param suiteId suite id
     * @param authCorpId The corpid of the authorized enterprise
     * @return DingTalkServerAuthInfoResponse
     */
    DingTalkServerAuthInfoResponse getAuthCorpInfo(String suiteId, String authCorpId);

    /**
     * Activate the application. After receiving the enterprise authorized application activation event pushed by the
     * HTTP callback, call this API to activate the enterprise authorized application.
     *
     * @param suiteId suite id
     * @param authCorpId The corpid of the authorized enterprise
     * @param permanentCode Permanent authorization code of authorized enterprise
     * @return Boolean
     */
    Boolean activateSuite(String suiteId, String authCorpId, String permanentCode);

    /**
     * Get the identity information of the application administrator
     *
     * @param suiteId suite id
     * @param code The code brought to the URL through Oauth authentication。
     * @return DingTalkSsoUserInfoResponse
     */
    DingTalkSsoUserInfoResponse getSsoUserInfoByCode(String suiteId, String code);

    /**
     * Obtaining user information through a free code (v2)
     *
     * @param suiteId suite id
     * @param authCorpId The corpid of the authorized enterprise
     * @param code No-login authorization code
     * @return UserInfoV2
     */
    DingTalkUserInfoV2Response getUserInfoV2ByCode(String suiteId, String authCorpId, String code);

    /**
     * Get user details based on userid
     *
     * @param suiteId suite id
     * @param authCorpId The corpid of the authorized enterprise
     * @param userId dingtalk userid
     * @return DingTalkUserDetailResponse
     */
    DingTalkUserDetailResponse getUserDetailByUserId(String suiteId, String authCorpId, String userId);

    /**
     * DingTalk ISV Application--Get a list of department sub-IDs
     *
     * @param suiteId suite id
     * @param authCorpId The corpid of the authorized enterprise
     * @param deptId Parent department ID, pass 1 for the root department.
     * @return Sub-department ID list
     */
    DingTalkDepartmentSubIdListResponse getDepartmentSubIdList(String suiteId, String authCorpId, Long deptId);

    /**
     * Get department user details
     * @param suiteId suite id
     * @param authCorpId The corpid of the authorized enterprise
     * @param deptId Department ID
     * @param cursor The cursor of the paging query, first pass 0, and then pass the next cursor value in the returned parameter.
     * @param size Paging Size
     * @param orderField Sorting Rules for Department Members
     * @param containAccessLimit Whether to return employees with restricted access
     * @param languageType contact language
     * @return UserPageResult
     */
    DingTalkUserListResponse getUserList(String suiteId, String authCorpId, Long deptId, Integer cursor, Integer size,
            DingTalkOrderField orderField, Boolean containAccessLimit, DingTalkLanguageType languageType);

    /**
     * Send job notification messages using templates
     *
     * @param suiteId suite id
     * @param authCorpId The corpid of the authorized enterprise
     * @param agentId Isv applications can call the interface to obtain enterprise authorization information to obtain
     * @param templateId message template id
     * @param data Message template dynamic parameter assignment data, indicating that both key and value are in string format.
     * @param userIds The maximum length of DingTalk user ID is 100
     * @return Created asynchronous send task ID
     */
    DingTalkAsyncSendCorpMessageResponse sendMessageToUserByTemplateId(String suiteId, String authCorpId, String agentId,
            String templateId, String data, List<String> userIds);

    /**
     * Create apaas application
     * @param suiteId suite id
     * @param authCorpId The corpid of the authorized enterprise
     * @param request request parameters
     * @return DingTalkCreateApaasAppResponse
     */
    DingTalkCreateApaasAppResponse createMicroApaasApp(String suiteId, String authCorpId, DingTalkCreateApaasAppRequest request);

    /**
     * Upload media files
     *
     * @param suiteId suite id
     * @param authCorpId The corpid of the authorized enterprise
     * @param mediaType media type
     * @param file file
     * @return DingTalkMediaCreateResponse
     */
    DingTalkMediaUploadResponse uploadMedia(String suiteId, String authCorpId, DingTalkMediaType mediaType, File file);

    /**
     * Get the SKU page address of in-app purchase products
     * @param suiteId suite id
     * @param authCorpId The corpid of the authorized enterprise
     * @param goodsCode product code
     * @param callbackPage Callback page (for URLEncode processing), the micro application is the page URL, and the E application is the page path address.
     * @param extendParam parameter
     * @return DingTalkSkuPageResponse
     */
    DingTalkSkuPageResponse getInternalSkuPage(String suiteId, String authCorpId, String goodsCode, String callbackPage,
            String extendParam);

    /**
     * In-app purchase order processing completed
     * Call this interface to complete in-app purchase order processing。
     *
     * @param suiteId suite id
     * @param authCorpId The corpid of the authorized enterprise
     * @param orderId In-app purchase order id.
     * @return BaseResponse
     */
    BaseResponse internalOrderFinish(String suiteId, String authCorpId, String orderId);

    /**
     * Get in-app purchase order information
     *
     * @param suiteId suite id
     * @param authCorpId The corpid of the authorized enterprise
     * @param orderId In-app purchase order id.
     * @return DingTalkInternalOrderResponse
     */
    DingTalkInternalOrderResponse getInternalOrder(String suiteId, String authCorpId, String orderId);

    /**
     * Get the number of employees
     *
     * @param suiteId suite id
     * @param authCorpId The corpid of the authorized enterprise
     * @param onlyActive Whether to include the number of people who have not activated DingTal. false: Include the
     * number of people who have not activated DingTalk. true: Only include the number of people who activated DingTalk.
     * @return number of workers
     */
    Integer getUserCount(String suiteId, String authCorpId, Boolean onlyActive);

    /**
     * Get department user ID
     *
     * @param suiteId suite id
     * @param authCorpId The corpid of the authorized enterprise
     * @param deptId Department ID
     * @return DingTalkDepartmentUserIdListResponse
     */
    DingTalkDepartmentUserIdListResponse getUserIdListByDeptId(String suiteId, String authCorpId, Long deptId);
}
