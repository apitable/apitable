package com.vikadata.social.feishu.event.app;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.annotation.FeishuEvent;
import com.vikadata.social.feishu.event.BaseEvent;

/**
 * App store app purchases
 */
@Setter
@Getter
@ToString
@FeishuEvent("order_paid")
public class OrderPaidEvent extends BaseEvent {
    private String orderId;

    /**
     * Paid plan ID
     */
    private String pricePlanId;

    /**
     * User purchase plan type "trial" - trial; "permanent" - one-time payment;
     * "per_year" - enterprise annual payment; "per_month" - enterprise monthly payment;
     * "per seat per year" - pay per person per year; "per seat per month" - pay per person per month;
     * "permanent count" - pay per use
     */
    private String pricePlanType;

    /**
     * Indicates how many servings were purchased
     */
    private Integer seats;

    /**
     * The number of package purchases is currently 1
     */
    private Integer buyCount;

    private String createTime;

    private String payTime;

    /**
     * Purchase type buy ordinary purchase upgrade is an upgrade purchase renew is a renewal purchase
     */
    private String buyType;

    /**
     * When it is currently an upgrade purchase (buy_type is upgrade),
     * this field represents the original order ID. After the upgrade, the original order becomes invalid and the
     * status becomes upgraded (the business side needs to process it)
     */
    private String srcOrderId;

    /**
     * Order payment price Unit points
     */
    private Long orderPayPrice;
}
