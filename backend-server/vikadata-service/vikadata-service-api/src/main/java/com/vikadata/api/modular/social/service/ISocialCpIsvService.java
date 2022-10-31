package com.vikadata.api.modular.social.service;

import java.time.LocalDateTime;
import java.util.List;

import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.bean.WxCpTpContactSearchResp;
import me.chanjar.weixin.cp.bean.message.WxCpMessage;

import com.vikadata.api.modular.social.model.WeComIsvJsSdkAgentConfigVo;
import com.vikadata.api.modular.social.model.WeComIsvJsSdkConfigVo;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.social.wecom.event.order.WeComOrderPaidEvent;
import com.vikadata.social.wecom.model.WxCpIsvAuthInfo.EditionInfo;
import com.vikadata.social.wecom.model.WxCpIsvGetOrder;
import com.vikadata.social.wecom.model.WxCpIsvPermanentCodeInfo;

/**
 * <p>
 * Third party platform integration - WeCom third-party service provider
 * </p>
 */
public interface ISocialCpIsvService {

    /**
     * Refresh access_ token, do not force refresh
     *
     * @param suiteId Application Suit ID
     * @param authCorpId Enterprise ID
     * @param permanentCode Enterprise permanent authorization code
     */
    void refreshAccessToken(String suiteId, String authCorpId, String permanentCode);

    /**
     * Refresh access_ token
     *
     * @param suiteId Application Suit ID
     * @param authCorpId Enterprise ID
     * @param permanentCode Enterprise permanent authorization code
     * @param forceRefresh Whether to force refresh
     */
    void refreshAccessToken(String suiteId, String authCorpId, String permanentCode, boolean forceRefresh);

    /**
     * Obtain the configuration parameters for JS-SDK to verify the enterprise identity and permission
     *
     * @param socialTenantEntity Tenant information bound by WeCom
     * @param url URL of the current page, exclude # and its subsequent parts
     * @return JS-SDK Verify the configuration parameters of enterprise identity and authority
     */
    WeComIsvJsSdkConfigVo getJsSdkConfig(SocialTenantEntity socialTenantEntity, String url) throws WxErrorException;

    /**
     * Get the configuration parameters of JS-SDK verification application identity and permission
     *
     * @param socialTenantEntity Tenant information bound by WeCom
     * @param url URL of the current page, exclude # and its subsequent parts
     * @return JS-SDK Verify the configuration parameters of enterprise identity and authority
     */
    WeComIsvJsSdkAgentConfigVo getJsSdkAgentConfig(SocialTenantEntity socialTenantEntity, String url) throws WxErrorException;

    /**
     * Create tenants based on permanent authorization information
     *
     * @param suiteId Application Suit ID
     * @param authCorpId Authorized Enterprise ID
     * @param permanentCodeInfo Permanent authorization information
     * @throws WxErrorException WeCom Interface Exception
     */
    void createAuthFromPermanentInfo(String suiteId, String authCorpId, WxCpIsvPermanentCodeInfo permanentCodeInfo) throws WxErrorException;

    /**
     * Create a new space station for tenants who have deleted the space station
     *
     * @param suiteId Application Suit ID
     * @param authCorpId ID of authorized enterprise
     */
    void createNewSpace(String suiteId, String authCorpId);

    /**
     * Judge whether the user is within the visible range of the application
     *
     * <p>
     * Need to clear temporary cache
     * </p>
     *
     * @param corpId Enterprise ID
     * @param cpUserId User's ID
     * @param suiteId Application Suit ID
     * @param allowUsers WeCom Visible Users
     * @param allowParties WeCom departments of WeCom
     * @param allowTags WeCom Visible Label
     * @return Whether the user is within the WeCom range of the application
     * @throws WxErrorException WeCom Interface Exception
     */
    boolean judgeViewable(String corpId, String cpUserId, String suiteId,
            List<String> allowUsers, List<Integer> allowParties, List<Integer> allowTags)
            throws WxErrorException;

    /**
     * According to the rules, create and bind the master administrator for the space station
     *
     * @param suiteId Application Suit ID
     * @param authCorpId Authorized Enterprise ID
     * @param authCpUserId WeCom user ID of operation authorization
     * @param agentId App ID after installation
     * @param authMode Authorization Mode
     * @param spaceId Space ID
     * @param allowUsers WeCom Visible Users
     * @param allowParties WeCom departments of WeCom
     * @param allowTags WeCom Visible Label
     * @throws WxErrorException WeCom Interface Exception
     */
    void bindSpaceAdmin(String suiteId, String authCorpId, String authCpUserId,
            Integer agentId, Integer authMode, String spaceId,
            List<String> allowUsers, List<Integer> allowParties, List<Integer> allowTags)
            throws WxErrorException;

    /**
     * Synchronize all visible members
     *
     * <p>
     * Need to clear temporary cache
     * </p>
     *
     * @param suiteId Application Suit ID
     * @param authCorpId Authorized Enterprise ID
     * @param spaceId Space ID
     * @param allowUsers WeCom Visible Users
     * @param allowParties WeCom departments of WeCom
     * @param allowTags WeCom Visible Label
     * @throws WxErrorException WeCom Interface Exception
     */
    void syncViewableUsers(String suiteId, String authCorpId, String spaceId,
            List<String> allowUsers, List<Integer> allowParties, List<Integer> allowTags)
            throws WxErrorException;

    /**
     * Synchronize individual members
     *
     * <p>
     * Need to clear temporary cache
     * </p>
     *
     * @param corpId Enterprise ID
     * @param cpUserId ID of authorized administrator (member)
     * @param suiteId Application Suit ID
     * @param spaceId Space ID
     * @param isAdmin Set this user as the primary administrator
     */
    void syncSingleUser(String corpId, String cpUserId, String suiteId, String spaceId, boolean isAdmin);

    /**
     * Clear all temporary caches of authorized enterprises during address book operations
     *
     * @param authCorpId ID of authorized enterprise
     */
    void clearCache(String authCorpId);

    /**
     * Send Start Using Message
     *
     * @param socialTenantEntity Tenant information
     * @param spaceId Space ID
     * @param wxCpMessage Message Body
     * @param toUsers Received users
     * @param toParties Receiving department
     * @param toTags Received tags
     * @throws WxErrorException WeCom Interface Exception
     */
    void sendWelcomeMessage(SocialTenantEntity socialTenantEntity, String spaceId, WxCpMessage wxCpMessage,
            List<String> toUsers, List<Integer> toParties, List<Integer> toTags) throws WxErrorException;

    /**
     * Send the start message to the users in the new member cache list
     *
     * @param socialTenantEntity Tenant information
     * @param spaceId Space ID
     * @param wxCpMessage Message Body
     * @throws WxErrorException WeCom Interface Exception
     */
    void sendWelcomeMessage(SocialTenantEntity socialTenantEntity, String spaceId, WxCpMessage wxCpMessage) throws WxErrorException;

    /**
     * Send a message to the specified user
     *
     * @param socialTenantEntity Tenant information
     * @param spaceId Space ID
     * @param wxCpMessage Message Body
     * @param toUsers Received users
     * @throws WxErrorException WeCom Interface Exception
     */
    void sendMessageToUser(SocialTenantEntity socialTenantEntity, String spaceId, WxCpMessage wxCpMessage,
            List<String> toUsers) throws WxErrorException;

    /**
     * Send the template message to the specified user
     *
     * @param socialTenantEntity Tenant information
     * @param spaceId Space ID
     * @param wxCpMessage Message Body
     * @param toUsers Received users
     * @throws WxErrorException WeCom Interface Exception
     */
    void sendTemplateMessageToUser(SocialTenantEntity socialTenantEntity, String spaceId, WxCpMessage wxCpMessage,
            List<String> toUsers) throws WxErrorException;

    /**
     * Fuzzy search user or department
     *
     * @param suiteId Application Suit ID
     * @param authCorpId Authorized Enterprise ID
     * @param agentId Application ID after authorization
     * @param keyword Search keywords
     * @param type Search type. If it is blank, all items will be queried. 1: Users; 2: Department
     * @return Matching user or department
     * @throws WxErrorException WeCom Interface Exception
     */
    WxCpTpContactSearchResp.QueryResult search(String suiteId, String authCorpId, Integer agentId, String keyword, Integer type) throws WxErrorException;

    /**
     * handle wecom paid subscription for existed order
     *
     * @param suiteId Wecom isv suite ID
     * @param authCorpId Paid corporation ID
     * @param spaceId Optionally, vika space ID
     * @param orderEntity Existed order info
     */
    void handleTenantPaidSubscribe(String suiteId, String authCorpId, String spaceId, WeComOrderPaidEvent orderEntity);

    /**
     * get isv corp auth info
     * @param authCorpId authorized corp ID
     * @param suiteId suite id
     * @return WxCpIsvAuthInfo
     */
    EditionInfo.Agent getCorpEditionInfo(String authCorpId, String suiteId);

    /**
     * get corp order list
     * @param startTime  start time
     * @param startTime  end time
     * @param suiteId suite id
     * @return List<WxCpIsvGetOrder>
     */
    List<WxCpIsvGetOrder> getOrderList(String suiteId, LocalDateTime startTime);


    /**
     * get order paid event
     * @param suiteId suite id
     * @param orderId order id
     * @return WeComOrderPaidEvent
     */
    WeComOrderPaidEvent fetchPaidEvent(String suiteId, String orderId) throws WxErrorException;

    /**
     * migrate order event
     * @param orders one corp orders
     */
    void migrateOrderEvent(List<WxCpIsvGetOrder> orders);
}
