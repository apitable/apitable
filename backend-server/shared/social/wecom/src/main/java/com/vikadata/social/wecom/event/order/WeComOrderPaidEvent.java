package com.vikadata.social.wecom.event.order;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Wecom order has been paid
 */
@Setter
@Getter
@ToString
public class WeComOrderPaidEvent extends BaseWeComOrderEvent {

    /**
     * Order Status.
     * 0-to be paid, 1-paid, 2-cancelled, 3-payment expired, 4-refund application, 5-refund successful, 6-refund rejected
     */
    private Integer orderStatus;

    /**
     * Order Type.
     * 0- Newly purchased applications, 1- Number of applications to expand, 2- Renewal application time, 3- Change version
     */
    private Integer orderType;

    /**
     * Userid of the operator who placed the order. If the order is placed by the service provider, there is no such field.
     */
    private String operatorId;

    /**
     * Purchase version ID
     */
    private String editionId;

    /**
     * buy version name
     */
    private String editionName;

    /**
     * Price payable, unit cents
     */
    private Integer price;

    /**
     * buy user count
     */
    private Long userCount;

    /**
     *The duration of the purchase, in days
     */
    private Integer orderPeriod;

    /**
     * The time the order was placed (UNIX timestamp). second
     */
    private Long orderTime;

    /**
     * Payment time (UNIX timestamp). second
     */
    private Long paidTime;

    /**
     * The start time (UNIX timestamp) of the purchase validity period. second
     */
    private Long beginTime;

    /**
     * The end time (UNIX timestamp) of the purchase validity period. second
     */
    private Long endTime;

    /**
     * Order source. 0-Enterprise orders; 1-Service providers place orders; 2-Agents place orders
     */
    private Integer orderFrom;

    /**
     * ordering party corpid
     */
    private String operatorCorpId;

    /**
     * Service provider share amount, unit points
     */
    private Integer serviceShareAmount;

    /**
     * Platform share amount, unit points
     */
    private Integer platformShareAmount;

    /**
     * The agent's share of the amount, unit points
     */
    private Integer dealerShareAmount;

    /**
     * Channel Provider Information (This field will only be available when a channel Provider has reported it)
     */
    private DealerCorpInfo dealerCorpInfo;

    @Setter
    @Getter
    public static class DealerCorpInfo implements Serializable {

        /**
         * agent corpid
         */
        private String corpId;

        /**
         * Agent's business abbreviation
         */
        private String corpName;

    }

}
