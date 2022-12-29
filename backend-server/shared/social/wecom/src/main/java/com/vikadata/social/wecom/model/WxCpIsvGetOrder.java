package com.vikadata.social.wecom.model;

import java.io.Serializable;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
import me.chanjar.weixin.cp.bean.WxCpBaseResp;
import me.chanjar.weixin.cp.util.json.WxCpGsonBuilder;

/**
 * Get order details
 */
@Setter
@Getter
public class WxCpIsvGetOrder extends WxCpBaseResp {

    /**
     * order id
     */
    @SerializedName("orderid")
    private String orderId;

    /**
     * Order Status. 0-to be paid, 1-paid, 2-cancelled, 3-payment expired, 4-refund application, 5-refund successful, 6-refund rejected
     */
    @SerializedName("order_status")
    private Integer orderStatus;

    /**
     * Order Type. 0- Newly purchased applications, 1- Number of applications to expand, 2- Renewal application time, 3- Change version
     */
    @SerializedName("order_type")
    private Integer orderType;

    /**
     * The corpid of the client company
     */
    @SerializedName("paid_corpid")
    private String paidCorpId;

    /**
     * Userid of the operator who placed the order.
     * If the order is placed by the service provider, there is no such field.
     */
    @SerializedName("operator_id")
    private String operatorId;

    /**
     * suiteId(Only old kits have this field)
     */
    @SerializedName("suiteid")
    private String suiteId;

    /**
     * app id
     */
    @SerializedName("appid")
    private Integer appId;

    /**
     * edition id
     */
    @SerializedName("edition_id")
    private String editionId;

    /**
     * buy edition name
     */
    @SerializedName("edition_name")
    private String editionName;

    /**
     * Price payable, unit cents
     */
    @SerializedName("price")
    private Integer price;

    /**
     * bought number of seats
     */
    @SerializedName("user_count")
    private Long userCount;

    /**
     * The duration of the purchase, in days
     */
    @SerializedName("order_period")
    private Integer orderPeriod;

    /**
     * The time the order was placed (UNIX timestamp). second
     */
    @SerializedName("order_time")
    private Long orderTime;

    /**
     * Payment time (UNIX timestamp). second
     */
    @SerializedName("paid_time")
    private Long paidTime;

    /**
     * The start time (UNIX timestamp) of the purchase validity period. second
     */
    @SerializedName("begin_time")
    private Long beginTime;

    /**
     * The end time (UNIX timestamp) of the purchase validity period. second
     */
    @SerializedName("end_time")
    private Long endTime;

    /**
     * Order source. 0-Enterprise orders; 1-Service providers place orders; 2-Agents place orders
     */
    @SerializedName("order_from")
    private Integer orderFrom;

    /**
     * ordering party corpid
     */
    @SerializedName("operator_corpid")
    private String operatorCorpId;

    /**
     * Service provider share amount, unit points
     */
    @SerializedName("service_share_amount")
    private Integer serviceShareAmount;

    /**
     * Platform share amount, unit points
     */
    @SerializedName("platform_share_amount")
    private Integer platformShareAmount;

    /**
     * The agent's share of the amount, unit points
     */
    @SerializedName("dealer_share_amount")
    private Integer dealerShareAmount;

    /**
     * Channel Provider Information (This field will only be available when a channel Provider has reported it)
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
         * Agent's corpid
         */
        @SerializedName("corpid")
        private String corpId;

        /**
         * Agent's business abbreviation
         */
        @SerializedName("corp_name")
        private String corpName;

    }

}
