package com.vikadata.social.wecom;

import java.util.List;

import cn.hutool.core.text.CharSequenceUtil;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.config.WxCpTpConfigStorage;
import me.chanjar.weixin.cp.tp.service.impl.BaseWxCpTpServiceImpl;
import org.apache.http.HttpHost;
import org.apache.http.impl.client.CloseableHttpClient;

import com.vikadata.social.wecom.model.WxCpIsvPermitBatchActiveAccountRequest;
import com.vikadata.social.wecom.model.WxCpIsvPermitBatchActiveAccountResponse;
import com.vikadata.social.wecom.model.WxCpIsvPermitBatchGetActiveInfo;
import com.vikadata.social.wecom.model.WxCpIsvPermitCreateNewOrder;
import com.vikadata.social.wecom.model.WxCpIsvPermitCreateRenewOrderRequest;
import com.vikadata.social.wecom.model.WxCpIsvPermitCreateRenewOrderResponse;
import com.vikadata.social.wecom.model.WxCpIsvPermitGetOrder;
import com.vikadata.social.wecom.model.WxCpIsvPermitListOrderAccount;
import com.vikadata.social.wecom.model.WxCpIsvPermitSubmitRenewOrder;

/**
 * <p>
 * 企微服务商接口许可相关接口
 * </p>
 * @author 刘斌华
 * @date 2022-06-23 17:01:45
 */
public class WxCpIsvPermitServiceImpl {

    private static final String URI_CREATE_NEW_ORDER = "/cgi-bin/license/create_new_order";
    private static final String URI_GET_ORDER = "/cgi-bin/license/get_order";
    private static final String URI_LIST_ORDER_ACCOUNT = "/cgi-bin/license/list_order_account";
    private static final String URI_BATCH_GET_ACTIVE_INFO = "/cgi-bin/license/batch_get_active_info_by_code";
    private static final String URI_BATCH_ACTIVE_ACCOUNT = "/cgi-bin/license/batch_active_account";
    private static final String URI_CREATE_RENEW_ORDER = "/cgi-bin/license/create_renew_order_job";
    private static final String URI_SUBMIT_RENEW_ORDER = "/cgi-bin/license/submit_order_job";

    private final BaseWxCpTpServiceImpl<CloseableHttpClient, HttpHost> mainService;

    public WxCpIsvPermitServiceImpl(BaseWxCpTpServiceImpl<CloseableHttpClient, HttpHost> mainService) {
        this.mainService = mainService;
    }

    /**
     * 下单购买账号
     *
     * @param authCorpId 授权企业的 ID
     * @param baseAccountCount 基础帐号个数，最多1000000个。(若企业为服务商测试企业，最多购买1000个)
     * @param durationMonths 购买的月数，每个月按照31天计算。最多购买36个月。(若企业为服务商测试企业，最多购买1个月)
     * @param buyerUserId 下单人。服务商企业内成员userid。该userid必须登录过企业微信，并且企业微信已绑定微信。最终也支持由其他人支付
     * @return 下单结果
     * @author 刘斌华
     * @date 2022-06-23 17:25:11
     */
    public WxCpIsvPermitCreateNewOrder createNewOrder(String authCorpId, Integer baseAccountCount,
            Integer durationMonths, String buyerUserId) throws WxErrorException {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("corpid", authCorpId);
        jsonObject.addProperty("buyer_userid", buyerUserId);
        JsonObject accountCount = new JsonObject();
        accountCount.addProperty("base_count", baseAccountCount);
        jsonObject.add("account_count", accountCount);
        JsonObject accountDuration = new JsonObject();
        accountDuration.addProperty("months", durationMonths);
        jsonObject.add("account_duration", accountDuration);
        @SuppressWarnings("deprecation")
        WxCpTpConfigStorage wxCpTpConfigStorage = mainService.getWxCpTpConfigStorage();
        String providerAccessToken = mainService.getWxCpProviderToken();
        String result = mainService.post(wxCpTpConfigStorage.getApiUrl(URI_CREATE_NEW_ORDER) +
                "?provider_access_token=" + providerAccessToken, jsonObject.toString(), true);

        return WxCpIsvPermitCreateNewOrder.fromJson(result);
    }

    /**
     * 获取订单详情
     *
     * @param orderId 接口许可订单号
     * @return 订单详情
     * @author 刘斌华
     * @date 2022-06-23 19:16:24
     */
    public WxCpIsvPermitGetOrder getOrder(String orderId) throws WxErrorException {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("order_id", orderId);
        @SuppressWarnings("deprecation")
        WxCpTpConfigStorage wxCpTpConfigStorage = mainService.getWxCpTpConfigStorage();
        String providerAccessToken = mainService.getWxCpProviderToken();
        String result = mainService.post(wxCpTpConfigStorage.getApiUrl(URI_GET_ORDER) +
                "?provider_access_token=" + providerAccessToken, jsonObject.toString(), true);

        return WxCpIsvPermitGetOrder.fromJson(result);
    }

    /**
     * 获取订单中的账号列表
     *
     * @param orderId 接口许可订单号
     * @param limit 返回的最大记录数，整型，最大值1000，默认值500
     * @param cursor 用于分页查询的游标，字符串类型，由上一次调用返回，首次调用可不填
     * @return 订单详情
     * @author 刘斌华
     * @date 2022-06-23 19:16:24
     */
    public WxCpIsvPermitListOrderAccount listOrderAccount(String orderId, Integer limit, String cursor) throws WxErrorException {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("order_id", orderId);
        jsonObject.addProperty("limit", limit);
        if (CharSequenceUtil.isNotBlank(cursor)) {
            jsonObject.addProperty("cursor", cursor);
        }
        @SuppressWarnings("deprecation")
        WxCpTpConfigStorage wxCpTpConfigStorage = mainService.getWxCpTpConfigStorage();
        String providerAccessToken = mainService.getWxCpProviderToken();
        String result = mainService.post(wxCpTpConfigStorage.getApiUrl(URI_LIST_ORDER_ACCOUNT) +
                "?provider_access_token=" + providerAccessToken, jsonObject.toString(), true);

        return WxCpIsvPermitListOrderAccount.fromJson(result);
    }

    /**
     * 批量获取接口许可账号的详情
     *
     * @param authCorpId 授权的企业 ID
     * @param activeCodes 接口许可激活码列表，最多不超过1000个
     * @return 激活码详情
     * @author 刘斌华
     * @date 2022-06-29 18:36:49
     */
    public WxCpIsvPermitBatchGetActiveInfo batchGetActiveInfo(String authCorpId, List<String> activeCodes) throws WxErrorException {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("corpid", authCorpId);
        JsonArray activeCodeList = new JsonArray(activeCodes.size());
        activeCodes.forEach(activeCodeList::add);
        jsonObject.add("active_code_list", activeCodeList);
        @SuppressWarnings("deprecation")
        WxCpTpConfigStorage wxCpTpConfigStorage = mainService.getWxCpTpConfigStorage();
        String providerAccessToken = mainService.getWxCpProviderToken();
        String result = mainService.post(wxCpTpConfigStorage.getApiUrl(URI_BATCH_GET_ACTIVE_INFO) +
                "?provider_access_token=" + providerAccessToken, jsonObject.toString(), true);

        return WxCpIsvPermitBatchGetActiveInfo.fromJson(result);
    }

    /**
     * 批量激活接口许可账号
     *
     * @param request 请求参数
     * @return 返回结果
     * @author 刘斌华
     * @date 2022-06-29 17:11:09
     */
    public WxCpIsvPermitBatchActiveAccountResponse batchActiveAccount(WxCpIsvPermitBatchActiveAccountRequest request) throws WxErrorException {
        @SuppressWarnings("deprecation")
        WxCpTpConfigStorage wxCpTpConfigStorage = mainService.getWxCpTpConfigStorage();
        String providerAccessToken = mainService.getWxCpProviderToken();
        String result = mainService.post(wxCpTpConfigStorage.getApiUrl(URI_BATCH_ACTIVE_ACCOUNT) +
                "?provider_access_token=" + providerAccessToken, request.toJson(), true);

        return WxCpIsvPermitBatchActiveAccountResponse.fromJson(result);
    }

    /**
     * 创建账号续期任务
     *
     * @param request 请求参数
     * @return 返回结果
     * @author 刘斌华
     * @date 2022-07-04 14:57:24
     */
    public WxCpIsvPermitCreateRenewOrderResponse createRenewOrder(WxCpIsvPermitCreateRenewOrderRequest request) throws WxErrorException {
        @SuppressWarnings("deprecation")
        WxCpTpConfigStorage wxCpTpConfigStorage = mainService.getWxCpTpConfigStorage();
        String providerAccessToken = mainService.getWxCpProviderToken();
        String result = mainService.post(wxCpTpConfigStorage.getApiUrl(URI_CREATE_RENEW_ORDER) +
                "?provider_access_token=" + providerAccessToken, request.toJson(), true);

        return WxCpIsvPermitCreateRenewOrderResponse.fromJson(result);
    }

    /**
     * 提交账号续期任务
     *
     * @param jobId 任务id
     * @param durationMonths 购买的月数，每个月按照31天计算。最多购买36个月。(若企业为服务商测试企业，每次续期只能续期1个月)
     * @param buyerUserId 下单人。服务商企业内成员userid。该userid必须登录过企业微信，并且企业微信已绑定微信
     * @return 返回结果
     * @author 刘斌华
     * @date 2022-07-04 15:09:33
     */
    public WxCpIsvPermitSubmitRenewOrder submitRenewOrder(String jobId, Integer durationMonths, String buyerUserId) throws WxErrorException {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("jobid", jobId);
        jsonObject.addProperty("buyer_userid", buyerUserId);
        JsonObject accountDuration = new JsonObject();
        accountDuration.addProperty("months", durationMonths);
        jsonObject.add("account_duration", accountDuration);
        @SuppressWarnings("deprecation")
        WxCpTpConfigStorage wxCpTpConfigStorage = mainService.getWxCpTpConfigStorage();
        String providerAccessToken = mainService.getWxCpProviderToken();
        String result = mainService.post(wxCpTpConfigStorage.getApiUrl(URI_SUBMIT_RENEW_ORDER) +
                "?provider_access_token=" + providerAccessToken, jsonObject.toString(), true);

        return WxCpIsvPermitSubmitRenewOrder.fromJson(result);
    }

}
