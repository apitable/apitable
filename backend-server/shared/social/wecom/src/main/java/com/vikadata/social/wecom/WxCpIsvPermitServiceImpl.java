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
 * Wecom Permit service implementation
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
     * Place an order to buy an account
     * @param authCorpId authorized company ID
     * @param baseAccountCount The number of basic accounts, up to 1,000,000.
     * (If the enterprise is a service provider testing enterprise, a maximum of 1000 can be purchased)
     * @param durationMonths The number of months purchased, each month is calculated as 31 days. Purchase up to 36 months.
     * (If the enterprise is a service provider testing enterprise, the maximum purchase is 1 month)
     * @param buyerUserId place an order. Member userid of the service provider enterprise.
     * The userid must have logged in to the enterprise WeChat, and the enterprise WeChat has been bound to WeChat.
     * Eventually also supports being paid by others
     * @return Order result
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
     * Get order details
     * @param orderId Interface license order number
     * @return order details
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
     * Get the list of accounts in the order
     * @param orderId Interface license order number
     * @param limit The maximum number of records to return, integer, the maximum value is 1000, the default value is 500
     * @param cursor Cursor used for paging query, string type, returned by the last call, can be left blank for the first call
     * @return order details
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
     * Obtain details of interface license accounts in batches
     * @param authCorpId Authorized Enterprise ID
     * @param activeCodes List of interface license activation codes, no more than 1000
     * @return Activation code details
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
     * Volume Activation of Interface License Accounts
     * @param request request parameters
     * @return WxCpIsvPermitBatchActiveAccountResponse
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
     * Create Account Renewal Task
     * @param request request parameters
     * @return WxCpIsvPermitCreateRenewOrderResponse
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
     * Submit Account Renewal Task
     * @param jobId task id
     * @param durationMonths The number of months purchased, each month is calculated as 31 days.
     * Purchase up to 36 months. (If the company is a service provider testing company, each renewal can only be renewed for 1 month)
     * @param buyerUserId place an order. Member userid of the service provider enterprise.
     * The userid must have logged in to the enterprise WeChat, and the enterprise WeChat has been bound to WeChat
     * @return WxCpIsvPermitSubmitRenewOrder
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
