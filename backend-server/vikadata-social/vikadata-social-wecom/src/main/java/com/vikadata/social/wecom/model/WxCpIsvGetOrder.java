package com.vikadata.social.wecom.model;

import java.io.Serializable;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
import me.chanjar.weixin.cp.bean.WxCpBaseResp;
import me.chanjar.weixin.cp.util.json.WxCpGsonBuilder;

/**
 * <p>
 * 获取订单详情
 * </p>
 * @author 刘斌华
 * @date 2022-04-22 10:56:17
 */
@Setter
@Getter
public class WxCpIsvGetOrder extends WxCpBaseResp {

    /**
     * 订单号
     */
    @SerializedName("orderid")
    private String orderId;

    /**
     * 订单状态。0-待支付，1-已支付，2-已取消， 3-支付过期， 4-申请退款中， 5-退款成功， 6-退款被拒绝
     */
    @SerializedName("order_status")
    private Integer orderStatus;

    /**
     * 订单类型。0-新购应用，1-扩容应用人数，2-续期应用时间，3-变更版本
     */
    @SerializedName("order_type")
    private Integer orderType;

    /**
     * 客户企业的corpid
     */
    @SerializedName("paid_corpid")
    private String paidCorpId;

    /**
     * 下单操作人员userid。如果是服务商代下单，没有该字段。
     */
    @SerializedName("operator_id")
    private String operatorId;

    /**
     * 应用id
     */
    @SerializedName("suiteid")
    private String suiteId;

    /**
     * 套件应用id（仅旧套件有该字段）
     */
    @SerializedName("appid")
    private Integer appId;

    /**
     * 购买版本ID
     */
    @SerializedName("edition_id")
    private String editionId;

    /**
     * 购买版本名字
     */
    @SerializedName("edition_name")
    private String editionName;

    /**
     * 应付价格，单位分
     */
    @SerializedName("price")
    private Integer price;

    /**
     * 购买的人数
     */
    @SerializedName("user_count")
    private Long userCount;

    /**
     * 购买的时长，单位为天
     */
    @SerializedName("order_period")
    private Integer orderPeriod;

    /**
     * 下单时间（UNIX时间戳）。秒
     */
    @SerializedName("order_time")
    private Long orderTime;

    /**
     * 付款时间（UNIX时间戳）。秒
     */
    @SerializedName("paid_time")
    private Long paidTime;

    /**
     * 购买生效期的开始时间（UNIX时间戳）。秒
     */
    @SerializedName("begin_time")
    private Long beginTime;

    /**
     * 购买生效期的结束时间（UNIX时间戳）。秒
     */
    @SerializedName("end_time")
    private Long endTime;

    /**
     * 下单来源。0-企业下单；1-服务商代下单；2-代理商代下单
     */
    @SerializedName("order_from")
    private Integer orderFrom;

    /**
     * 下单方corpid
     */
    @SerializedName("operator_corpid")
    private String operatorCorpId;

    /**
     * 服务商分成金额，单位分
     */
    @SerializedName("service_share_amount")
    private Integer serviceShareAmount;

    /**
     * 平台分成金额，单位分
     */
    @SerializedName("platform_share_amount")
    private Integer platformShareAmount;

    /**
     * 代理商分成金额，单位分
     */
    @SerializedName("dealer_share_amount")
    private Integer dealerShareAmount;

    /**
     * 渠道商信息（仅当有渠道商报备后才会有此字段）
     */
    @SerializedName("dealer_corp_info")
    private DealerCorpInfo dealerCorpInfo;

    public static WxCpIsvGetOrder fromJson(String json) {

        return WxCpGsonBuilder.create().fromJson(json, WxCpIsvGetOrder.class);

    }

    public String toJson() {

        return WxCpGsonBuilder.create().toJson(this);

    }

    @Setter
    @Getter
    public static class DealerCorpInfo implements Serializable {

        /**
         * 代理商corpid
         */
        @SerializedName("corpid")
        private String corpId;

        /**
         * 代理商的企业简称
         */
        @SerializedName("corp_name")
        private String corpName;

    }

}
