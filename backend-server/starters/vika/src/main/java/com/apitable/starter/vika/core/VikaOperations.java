package com.apitable.starter.vika.core;

import java.util.List;
import java.util.Map;

import cn.vika.client.api.model.Record;

import com.apitable.starter.vika.core.factory.CollaCommandFactory;
import com.apitable.starter.vika.core.model.BillingOrder;
import com.apitable.starter.vika.core.model.BillingOrderItem;
import com.apitable.starter.vika.core.model.BillingOrderPayment;
import com.apitable.starter.vika.core.model.DingTalkAgentAppInfo;
import com.apitable.starter.vika.core.model.DingTalkDaTemplateInfo;
import com.apitable.starter.vika.core.model.DingTalkGoodsInfo;
import com.apitable.starter.vika.core.model.DingTalkOrderInfo;
import com.apitable.starter.vika.core.model.DingTalkSubscriptionInfo;
import com.apitable.starter.vika.core.model.GlobalWidgetInfo;
import com.apitable.starter.vika.core.model.GmPermissionInfo;
import com.apitable.starter.vika.core.model.IntegralRewardInfo;
import com.apitable.starter.vika.core.model.OnlineTemplateInfo;
import com.apitable.starter.vika.core.model.OriginalWhite;
import com.apitable.starter.vika.core.model.RecommendTemplateInfo;
import com.apitable.starter.vika.core.model.UserContactInfo;
import com.apitable.starter.vika.core.model.UserOrder;
import com.apitable.starter.vika.core.model.template.TemplateCenterConfigInfo;
import com.apitable.starter.vika.core.model.template.TemplateConfigDatasheetParam;

/**
 * <p>
 * vika sdk interface
 * </p>
 *
 */
public interface VikaOperations {
    /**
     * Get GM permission configuration information
     *
     * @param dstId datasheet id
     * @return GMPermission information
     */
    List<GmPermissionInfo> getGmPermissionConfiguration(String dstId);

    /**
     * Get Template Center Config Infos
     *
     * @param host  request host
     * @param token request bearer token
     * @param param config datasheet object
     * @return TemplateCenterConfigInfos
     */
    List<TemplateCenterConfigInfo> getTemplateCenterConfigInfos(String host, String token, TemplateConfigDatasheetParam param);

    /**
     * Get configuration information of popular recommended templates
     *
     * @param dstId datasheet id
     * @param viewId view id
     * @param lang language
     * @return config information
     */
    @Deprecated
    List<RecommendTemplateInfo> getRecommendTemplateConfiguration(String dstId, String viewId, String lang);

    /**
     * Get the configuration information of the online template
     *
     * @param dstId datasheet id
     * @param lang language
     * @return config information
     */
    @Deprecated
    List<OnlineTemplateInfo> getOnlineTemplateConfiguration(String dstId, String lang);

    /**
     * Get the category of the template on the shelf
     *
     * @param dstId datasheet id
     * @param viewId view id
     * @param lang language
     * @return template type
     */
    @Deprecated
    List<String> getTemplateCategoryName(String dstId, String viewId, String lang);

    /**
     * Get the global widget/widget template configuration information
     *
     * @param dstId datasheet id
     * @return config information
     */
    List<GlobalWidgetInfo> getGlobalWidgetPackageConfiguration(String dstId);

    /**
     * Get the configuration of nail customization application
     *
     * @param dstId datasheet id
     * @return config information
     */
    List<DingTalkAgentAppInfo> getDingTalkAgentAppConfiguration(String dstId);

    /**
     * Save Statistics
     *
     * @param dstId datasheet id
     * @param data data
     */
    void saveStatisticsData(String dstId, String data);

    /**
     * Get the configuration of DingTalk custom application
     *
     * @param dstId Subscription plan ID
     * @param featureDstId Subscription Property Sheet
     * @return config information
     */
    List<DingTalkGoodsInfo> getDingTalkGoodsInfo(String token, String host, String dstId, String featureDstId);

    /**
     * Get billing plan property configuration
     *
     * @param featureDstId Subscription Property Sheet
     * @return Map<String, Record>
     */
    Map<String, Record> getBillingFeatures(String token, String host, String featureDstId);

    /**
     * Save DingTalk subscription information
     *
     * @param dstId datasheet id
     * @param subscriptionInfo Subscription information
     */
    void saveDingTalkSubscriptionInfo(String dstId, DingTalkSubscriptionInfo subscriptionInfo);

    /**
     * Get the order information stored in the vika
     *
     * @param dstId datasheet
     * @param viewId view id
     * @return List<DingTalkOrderInfo>
     */
    List<DingTalkOrderInfo> getDingTalkOrderInfoList(String dstId, String viewId);

    /**
     * Query customer order table
     *
     * @param host host
     * @param token token
     * @param dstId datasheet id
     * @return list
     */
    List<Map<String, Object>> fetchCustomerOrder(String host, String token, String dstId, String fiter);

    /**
     * Get white list records
     *
     * @return Original white list data
     */
    OriginalWhite fetchRecordOnWhiteList(String host, String token, String dstId);

    /**
     * Update white list processing status
     *
     * @param recordId record id
     * @param statusName status value
     */
    void updateWhiteMigrateStatus(String host, String token, String dstId, String recordId, String statusName);

    /**
     * Synchronize to new subscription order table
     *
     * @param originalWhite Source Order Table
     */
    void addRecordToBillingSheet(OriginalWhite originalWhite);

    /**
     * Get DingTalk template information
     *
     * @param dstId template configuration table ID
     * @param viewId view id
     */
    List<DingTalkDaTemplateInfo> getDingTalkDaTemplateInfo(String dstId, String viewId);

    /**
     * Get new orders
     *
     * @return UserOrder
     */
    UserOrder fetchOrderData();

    /**
     * Update order status
     *
     * @param recordId record id
     * @param statusName status name
     * @param statusDesc status remark information
     */
    void updateOrderHandleStatus(String recordId, String statusName, String statusDesc);

    /**
     * Execute Custom Command
     *
     * @param datasheetId datasheet id
     * @param request request parameters, reference:{@link CollaCommandFactory}
     */
    boolean executeCommand(String datasheetId, Map<String, Object> request);

    /**
     * Get integral reward information
     *
     * @param host host
     * @param token token
     * @param dstId datasheet id
     * @param viewId view id
     * @return IntegralRewardInfo
     */
    List<IntegralRewardInfo> getIntegralRewardInfo(String host, String token, String dstId, String viewId);

    /**
     * Update integral reward result
     *
     * @param host host
     * @param token token
     * @param dstId datasheet id
     * @param recordId view id
     * @param result result
     * @param processor processor
     */
    void updateIntegralRewardResult(String host, String token, String dstId, String recordId, String result, String processor);

    /**
     * Synchronize orders
     *
     * @param order order
     * @param items order items
     * @param payments order payment details
     */
    void syncOrder(BillingOrder order, List<BillingOrderItem> items, List<BillingOrderPayment> payments);

    /**
     * get user's id from datasheet
     *
     * @param host        host
     * @param datasheetId datasheet's id
     * @param viewId      view's id
     * @param token       api token
     * @return UserContactInfo    recordId and user's id
     * @author liuzijing
     * @date 2022/9/5
     */
    List<UserContactInfo> getUserIdFromDatasheet(String host, String datasheetId, String viewId, String token);

    /**
     * write back user's contact info
     *
     * @param host        host
     * @param token       token
     * @param dstId       datasheet's id
     * @param userContactInfo user's contact information
     * @author liuzijing
     * @date 2022/9/5
     */
    void writeBackUserContactInfo(String host, String token, String dstId, UserContactInfo userContactInfo);
}
