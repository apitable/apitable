package com.vikadata.integration.vika;

import java.util.List;
import java.util.Map;

import cn.vika.client.api.model.Record;

import com.vikadata.integration.vika.factory.CollaCommandFactory;
import com.vikadata.integration.vika.model.BillingOrder;
import com.vikadata.integration.vika.model.BillingOrderItem;
import com.vikadata.integration.vika.model.BillingOrderPayment;
import com.vikadata.integration.vika.model.DingTalkAgentAppInfo;
import com.vikadata.integration.vika.model.DingTalkDaTemplateInfo;
import com.vikadata.integration.vika.model.DingTalkGoodsInfo;
import com.vikadata.integration.vika.model.DingTalkOrderInfo;
import com.vikadata.integration.vika.model.DingTalkSubscriptionInfo;
import com.vikadata.integration.vika.model.GlobalWidgetInfo;
import com.vikadata.integration.vika.model.GmPermissionInfo;
import com.vikadata.integration.vika.model.IntegralRewardInfo;
import com.vikadata.integration.vika.model.OnlineTemplateInfo;
import com.vikadata.integration.vika.model.OriginalWhite;
import com.vikadata.integration.vika.model.RecommendTemplateInfo;
import com.vikadata.integration.vika.model.UserContactInfo;
import com.vikadata.integration.vika.model.UserOrder;
import com.vikadata.integration.vika.model.template.TemplateCenterConfigInfo;
import com.vikadata.integration.vika.model.template.TemplateConfigDatasheetParam;

/**
 * <p>
 * vika sdk 接口
 * </p>
 *
 * @author Chambers
 */
public interface VikaOperations {

    /**
     * 获取 GM 权限配置信息
     *
     * @param dstId 数表ID
     * @return 配置信息
     */
    List<GmPermissionInfo> getGmPermissionConfiguration(String dstId);

    /**
     * Get Template Center Config Infos
     *
     * @param host  request host
     * @param token request bearer token
     * @param param config datasheet object
     * @return TemplateCenterConfigInfos
     * @author Chambers
     * @date 2022/9/22
     */
    List<TemplateCenterConfigInfo> getTemplateCenterConfigInfos(String host, String token, TemplateConfigDatasheetParam param);

    /**
     * 获取热门推荐模板配置信息
     *
     * @param dstId 数表ID
     * @param viewId 视图ID
     * @param lang 语言
     * @return 配置信息
     */
    @Deprecated
    List<RecommendTemplateInfo> getRecommendTemplateConfiguration(String dstId, String viewId, String lang);

    /**
     * 获取上架模板配置信息
     *
     * @param dstId 数表ID
     * @param lang 语言
     * @return 配置信息
     */
    @Deprecated
    List<OnlineTemplateInfo> getOnlineTemplateConfiguration(String dstId, String lang);

    /**
     * 获取上架模板分类
     *
     * @param dstId 数表ID
     * @param viewId 视图ID
     * @param lang 语言
     * @return 模板类别
     */
    @Deprecated
    List<String> getTemplateCategoryName(String dstId, String viewId, String lang);

    /**
     * 获取全局小组件/小组件模版配置信息
     *
     * @param dstId 数表ID
     * @return 配置信息
     */
    List<GlobalWidgetInfo> getGlobalWidgetPackageConfiguration(String dstId);

    /**
     * 获取钉钉定制应用的配置
     *
     * @param dstId 数表ID
     * @return 配置信息
     */
    List<DingTalkAgentAppInfo> getDingTalkAgentAppConfiguration(String dstId);

    /**
     * 保存统计数据
     *
     * @param dstId 数表ID
     * @param data 数据
     */
    void saveStatisticsData(String dstId, String data);

    /**
     * 获取钉钉定制应用的配置
     *
     * @param dstId 订阅计划数表ID
     * @param featureDstId 订阅属性表
     * @return 配置信息
     */
    List<DingTalkGoodsInfo> getDingTalkGoodsInfo(String token, String host, String dstId, String featureDstId);

    /**
     * 获取订阅计划属性配置
     *
     * @param featureDstId 订阅属性表
     * @return Map<String, Record>
     */
    Map<String, Record> getBillingFeatures(String token, String host, String featureDstId);

    /**
     * 保存钉钉订阅信息
     *
     * @param dstId 数表ID
     * @param subscriptionInfo 订阅信息
     */
    void saveDingTalkSubscriptionInfo(String dstId, DingTalkSubscriptionInfo subscriptionInfo);

    /**
     * 获取维格表存储的订单信息
     *
     * @param dstId 数表ID
     * @param viewId 视图ID
     * @return List<DingTalkOrderInfo>
     */
    List<DingTalkOrderInfo> getDingTalkOrderInfoList(String dstId, String viewId);

    /**
     * 查询客户订单表
     *
     * @param host 主机
     * @param token 令牌
     * @param dstId 数表ID
     * @return 列表
     */
    List<Map<String, Object>> fetchCustomerOrder(String host, String token, String dstId, String fiter);

    /**
     * 获取白名单记录
     *
     * @return 原白名单数据
     */
    OriginalWhite fetchRecordOnWhiteList(String host, String token, String dstId);

    /**
     * 更新白名单处理状态
     *
     * @param recordId 记录ID
     * @param statusName 状态值
     */
    void updateWhiteMigrateStatus(String host, String token, String dstId, String recordId, String statusName);

    /**
     * 同步到新的订阅订单表
     *
     * @param originalWhite 源订单表
     */
    void addRecordToBillingSheet(OriginalWhite originalWhite);

    /**
     * 获取钉钉搭模版信息
     *
     * @param dstId 模版配置表ID
     * @param viewId 视图ID
     */
    List<DingTalkDaTemplateInfo> getDingTalkDaTemplateInfo(String dstId, String viewId);

    /**
     * 获取新订单
     *
     * @return UserOrder
     */
    UserOrder fetchOrderData();

    /**
     * 更新订单状态
     *
     * @param recordId 记录id
     * @param statusName 状态名
     * @param statusDesc 状态信息备注
     */
    void updateOrderHandleStatus(String recordId, String statusName, String statusDesc);

    /**
     * 执行自定义Command
     *
     * @param datasheetId 数表Id
     * @param request 请求参数，参考：{@link CollaCommandFactory}
     */
    boolean executeCommand(String datasheetId, Map<String, Object> request);

    /**
     * 获取积分奖励信息
     *
     * @param host 主机
     * @param token 令牌
     * @param dstId 数表ID
     * @param viewId 视图ID
     * @return IntegralRewardInfo
     */
    List<IntegralRewardInfo> getIntegralRewardInfo(String host, String token, String dstId, String viewId);

    /**
     * 更新积分奖励结果
     *
     * @param host 主机
     * @param token 令牌
     * @param dstId 数表ID
     * @param recordId 视图ID
     * @param result 结果
     * @param processor 处理者
     */
    void updateIntegralRewardResult(String host, String token, String dstId, String recordId, String result, String processor);

    /**
     * 同步订单
     *
     * @param order 订单
     * @param items 订单子项
     * @param payments 订单支付详情
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
