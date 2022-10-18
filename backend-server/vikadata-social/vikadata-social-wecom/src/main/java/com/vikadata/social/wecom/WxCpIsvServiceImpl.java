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
 * <p>
 * 企业微信第三方服务商接口调用
 * </p>
 * @author 刘斌华
 * @date 2022-01-18 11:45:51
 */
public class WxCpIsvServiceImpl extends WxCpTpServiceImpl {

    private static final String URI_GET_REGISTER_CODE = "/cgi-bin/service/get_register_code";

    private static final String URI_GET_ORDER = "/cgi-bin/service/get_order";

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
     * 重写获取永久授权码接口，增加订阅信息
     *
     * @param authCode 临时授权码
     * @return 授权码信息
     * @author 刘斌华
     * @date 2022-04-20 17:28:22
     */
    @Override
    public WxCpIsvPermanentCodeInfo getPermanentCodeInfo(String authCode) throws WxErrorException {

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("auth_code", authCode);
        String result = post(configStorage.getApiUrl(GET_PERMANENT_CODE), jsonObject.toString());

        return WxCpIsvPermanentCodeInfo.fromJson(result);

    }

    /**
     * 重写获取企业授权信息接口，增加订阅信息
     *
     * @param authCorpId 授权的企业 ID
     * @param permanentCode 永久授权码
     * @return 企业授权信息
     * @author 刘斌华
     * @date 2022-04-24 14:19:26
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
     * 重写获取应用管理员列表的接口，
     *
     * @see #getAdminList(String, Integer) 原接口有问题，没有返回 openUserId
     * @param authCorpId 授权的企业 ID
     * @param agentId 应用安装后的 ID
     * @return 应用的管理员
     * @author 刘斌华
     * @date 2022-01-19 14:32:07
     */
    public WxCpIsvAdmin getAuthCorpAdminList(String authCorpId, Integer agentId) throws WxErrorException {

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("auth_corpid", authCorpId);
        jsonObject.addProperty("agentid", agentId);
        String result = post(configStorage.getApiUrl(GET_ADMIN_LIST), jsonObject.toString());

        return WxCpIsvAdmin.fromJson(result);

    }

    /**
     * 根据注册模板生成注册码
     *
     * @param templateId 注册模板 ID
     * @return 注册码信息
     * @author 刘斌华
     * @date 2022-03-14 17:17:23
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
     * 发送应用消息
     *
     * @param authCorpId 授权的企业 ID
     * @param message 消息体
     * @return 发送结果
     * @author 刘斌华
     * @date 2022-01-21 16:02:40
     */
    public WxCpMessageSendResult sendMessage(String authCorpId, WxCpMessage message) throws WxErrorException {

        String url = configStorage.getApiUrl(MESSAGE_SEND);
        url += "?access_token=" + configStorage.getAccessToken(authCorpId);

        return WxCpMessageSendResult.fromJson(post(url, message.toJson()));

    }

    /**
     * 获取订单详情
     *
     * @param orderId 订单 ID
     * @return 订单详情
     * @author 刘斌华
     * @date 2022-04-22 10:57:27
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
        jsonObject.addProperty("start_time",startTimeSecond);
        jsonObject.addProperty("end_time", endTimeSecond);
        jsonObject.addProperty("test_mode", testMode);
        String result = post(configStorage.getApiUrl(URI_GET_ORDER), jsonObject.toString());
        return WxCpIsvGetOrderList.fromJson(result);
    }

}
