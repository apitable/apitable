package com.vikadata.social.dingtalk.event.order;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.annotation.DingTalkEvent;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;
import com.vikadata.social.dingtalk.enums.DingTalkSyncAction;

/**
 * <p>
 * 事件列表 -- 订单信息
 * 该数据为企业在钉钉服务市场购买开通应用产生订单时刻推送，插入表open_sync_biz_data中。
 * </p>
 * @author zoe zheng
 * @date 2021/10/25 11:37
 */
@Setter
@Getter
@ToString
@DingTalkEvent(value = DingTalkEventTag.SYNC_HTTP_PUSH_HIGH, action = DingTalkSyncAction.MARKET_ORDER)
public class SyncHttpMarketOrderEvent extends BaseOrderEvent {
    /**
     * 规格支持最大使用人数
     */
    private String maxOfPeople;

    /**
     * 规格支持最小使用人数。
     */
    private String minOfPeople;

    /**
     * 分销商企业名称。
     * 说明 当商品类型articleType为image时不返回此字段。
     */
    private String distributorCorpName;

    /**
     * 分销商企业corpId。
     * 说明 当商品类型articleType为image时不返回此字段。
     */
    private String distributorCorpId;

    /**
     * 支付时间（单位：毫秒）。
     */
    private Long paidtime;

    /**
     * 订单来源：
     * 默认订单来自应用中心。
     * 若值为TIANYUAN，表示来自天元系统平台。
     */
    private String orderCreatSource;

    /**
     * 名义票面费用（单位：分），现与payFee值相等。
     * 说明 当商品类型articleType为image时不返回此字段。
     */
    private Long nominalPayFee;

    /**
     * 折扣减免费用（单位：分），现值为0。
     * 说明 当商品类型articleType为image时不返回此字段。
     */
    private Long discountFee;

    /**
     * 折扣，现值为1.00。
     * 说明 当商品类型articleType为image时不返回此字段。
     */
    private Double discount;


    /**
     * 订单类型，取值：
     * BUY：新购
     * RENEW：续费
     * UPGRADE：升级
     * RENEW_UPGRADE：续费升配
     * RENEW_DEGRADE：续费降配
     */
    private String orderType;

    /**
     * 下单人unionId。
     */
    private String unionId;

    /**
     * 外部订单号。
     */
    private String outTradeNo;

    /**
     * 用户在当前开放应用内的唯一标识。
     */
    private String openId;


    /**
     * 购买类型。
     * 1：组织购买
     * 2：个人购买
     */
    private String purchaseType;

    /**
     * 订单来源渠道码。
     */
    private String orderChannelCode;

    /**
     * 开发者后台商品管理生成商品二维码时ISV填入的渠道码。
     */
    private String isvOperationCode;

    /**
     * 订单收费类型（仅针对试用规格）
     * FREE：免费开通
     * TRYOUT：试用开通
     */
    private String orderChargeType;

    /**
     * 商品类型，取值：
     * normal：普通商品
     * image：OXM镜像商品。
     * 说明 OXM商品：非官方商品纳入钉钉一方售卖的机制，需要确定对接方式，并经过必要的立项和评审环节，可融入付费钉钉或独立售卖，支持进入钉钉甄选市场的商品。
     */
    private String articleType;

    /**
     * 镜像商品对应的原生商品Code。
     * 说明 非OXM商品可不用关注该字段。
     */
    private String originalArticleCode;

    /**
     * 镜像商品对应的原生商品Code。
     * 说明 非OXM商品可不用关注该字段。
     */
    private String originalItemCode;

    /**
     * 应用ID。
     * 说明 内购订单时该字段有值。
     */
    private String appId;

    /**
     * 订单扩展参数。
     */
    private Object extendParam;

    /**
     * 下单人在企业内的工号。
     */
    private String buyUserId;

    /**
     * 解决方案KEY值。
     * 说明 当订单为解决方案时该字段有值。
     */
    private String solutionPackageKey;

    /**
     * 解决方案名称。
     * 说明 当订单为解决方案时该字段有值。
     */
    private String solutionPackageName;

    /**
     * 个人体验版虚拟组织对应的主组织ID。。
     */
    private String mainCorpId;

    /**
     * 自动转免费规格。
     * 说明 付费商品如果有免费规格，试用到期后会系统自动下单转免费规格，包含此订单标记。
     */
    private String autoChangeFreeItem;

    /**
     * 订单标记，取值
     * 0: 普通订单
     * 1：满赠订单
     */
    private Integer orderLabel;

    /**
     * 满赠订单关联的付费主订单ID。
     */
    private String presentRelMainOrderId;

    /**
     * 商机来源，取值包含：
     * 工作台-底部推荐
     * 工作台-分组推荐
     * 工作台-分组更多-顶部推荐位
     * 工作台-应用图标推荐
     * 广场-搜索
     * 广场-banner
     * 广场-专题
     * 广场-商品推荐
     * 应用中心-新企业管理员推荐
     * 应用中心-搜索
     * 应用中心-banner
     * 应用中心-专题
     * 应用中心-全部应用(安卓)
     * 应用中心-解决方案
     * 人事专区
     * 开发者后台-推广码
     * PC应用中心
     */
    private String leadsFrom;

    /**
     * 售卖模式，取值：
     * CYC_UPGRADE_MEMBER： 按周期 + 数量（人数）售卖
     * CYC_UPGRADE： 按周期售卖
     * QUANTITY： 按数量（人数）售卖
     */
    private String saleModelType;
}
