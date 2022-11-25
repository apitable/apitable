package com.vikadata.social.wecom;

import com.google.gson.JsonObject;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.bean.message.WxCpMessage;
import me.chanjar.weixin.cp.bean.message.WxCpMessageSendResult;
import me.chanjar.weixin.cp.tp.service.impl.WxCpTpServiceImpl;

import com.vikadata.social.wecom.model.WxCpIsvAdmin;
import com.vikadata.social.wecom.model.WxCpIsvAuthInfo;
import com.vikadata.social.wecom.model.WxCpIsvGetOrder;
import com.vikadata.social.wecom.model.WxCpIsvGetOrderList;
import com.vikadata.social.wecom.model.WxCpIsvGetRegisterCode;
import com.vikadata.social.wecom.model.WxCpIsvPermanentCodeInfo;

import static me.chanjar.weixin.cp.constant.WxCpApiPathConsts.Message.MESSAGE_SEND;
import static me.chanjar.weixin.cp.constant.WxCpApiPathConsts.Tp.GET_ADMIN_LIST;
import static me.chanjar.weixin.cp.constant.WxCpApiPathConsts.Tp.GET_AUTH_INFO;
import static me.chanjar.weixin.cp.constant.WxCpApiPathConsts.Tp.GET_PERMANENT_CODE;

/**
 * WeChat isv service provider interface call
 */
public class WxCpIsvServiceImpl extends WxCpTpServiceImpl {

    private static final String URI_GET_REGISTER_CODE = "/cgi-bin/service/get_register_code";

    private static final String URI_GET_ORDER = "/cgi-bin/service/get_order";

    private static final String URI_GET_ORDER_LIST = "/cgi-bin/service/get_order_list";

    private final WxCpIsvUserServiceImpl wxCpTpUserService = new WxCpIsvUserServiceImpl(this);

    private final WxCpIsvPermitServiceImpl wxCpIsvPermitService = new WxCpIsvPermitServiceImpl(this);

    @Override
    public WxCpIsvUserServiceImpl getWxCpTpUserService() {
        return wxCpTpUserService;
    }

    public WxCpIsvPermitServiceImpl getWxCpIsvPermitService() {
        return wxCpIsvPermitService;
    }

    /**
     * Rewrite the interface for obtaining permanent authorization code and add subscription information
     * @param authCode temporary authorization code
     * @return Authorization code information
     */
    @Override
    public WxCpIsvPermanentCodeInfo getPermanentCodeInfo(String authCode) throws WxErrorException {

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("auth_code", authCode);
        String result = post(configStorage.getApiUrl(GET_PERMANENT_CODE), jsonObject.toString());

        return WxCpIsvPermanentCodeInfo.fromJson(result);

    }

    /**
     * Rewrite the interface for get corp authorization information and add subscription information
     * @param authCorpId Authorized corp ID
     * @param permanentCode Permanent Authorization Code
     * @return Corp authorization information
     */
    @Override
    public WxCpIsvAuthInfo getAuthInfo(String authCorpId, String permanentCode) throws WxErrorException {

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("auth_corpid", authCorpId);
        jsonObject.addProperty("permanent_code", permanentCode);
        String result = post(configStorage.getApiUrl(GET_AUTH_INFO), jsonObject.toString());

        return WxCpIsvAuthInfo.fromJson(result);

    }

    /**
     * Rewrite the interface for getting the list of application administrators
     * @see #getAdminList(String, Integer) There is a problem with the original interface and no openUserId is returned
     * @param authCorpId Authorized corp id
     * @param agentId The id after the app is installed
     * @return application's administrator
     */
    public WxCpIsvAdmin getAuthCorpAdminList(String authCorpId, Integer agentId) throws WxErrorException {

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("auth_corpid", authCorpId);
        jsonObject.addProperty("agentid", agentId);
        String result = post(configStorage.getApiUrl(GET_ADMIN_LIST), jsonObject.toString());

        return WxCpIsvAdmin.fromJson(result);

    }

    /**
     * Generate registration code based on registration template
     * @param templateId Registration Template ID
     * @return Registration code information
     */
    public WxCpIsvGetRegisterCode getRegisterCode(String templateId) throws WxErrorException {

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("template_id", templateId);
        String providerAccessToken = getWxCpProviderToken();
        String result = post(configStorage.getApiUrl(URI_GET_REGISTER_CODE) +
                "?provider_access_token=" + providerAccessToken, jsonObject.toString(), true);

        return WxCpIsvGetRegisterCode.fromJson(result);

    }

    /**
     * Send app message
     *
     * @param authCorpId Authorized corp id
     * @param message message body
     * @return send result
     */
    public WxCpMessageSendResult sendMessage(String authCorpId, WxCpMessage message) throws WxErrorException {

        String url = configStorage.getApiUrl(MESSAGE_SEND);
        url += "?access_token=" + configStorage.getAccessToken(authCorpId);

        return WxCpMessageSendResult.fromJson(post(url, message.toJson()));

    }

    /**
     * Get order details
     *
     * @param orderId Order ID
     * @return order details
     */
    public WxCpIsvGetOrder getOrder(String orderId) throws WxErrorException {

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("orderid", orderId);
        String result = post(configStorage.getApiUrl(URI_GET_ORDER), jsonObject.toString());

        return WxCpIsvGetOrder.fromJson(result);

    }

    /**
     * get order list
     * @param startTimeSecond start time/ unit: second
     * @param endTimeSecond end time/ unit: second
     * @param testMode specifies the order to pull the official or test authorization. The default value is 0, where
     * 0 - official authorization, 1 - test authorization.
     * @return order list
     */
    public WxCpIsvGetOrderList getOrderList(Long startTimeSecond, Long endTimeSecond, int testMode) throws WxErrorException {

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("start_time", startTimeSecond);
        jsonObject.addProperty("end_time", endTimeSecond);
        jsonObject.addProperty("test_mode", testMode);
        String result = post(configStorage.getApiUrl(URI_GET_ORDER_LIST), jsonObject.toString());
        return WxCpIsvGetOrderList.fromJson(result);
    }

}
