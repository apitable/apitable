package com.vikadata.social.dingtalk.event.order;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.annotation.DingTalkEvent;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;
import com.vikadata.social.dingtalk.enums.DingTalkSyncAction;

/**
 * When biz type=37, the data is the service shutdown data due to order expiration or refund.
 * This data is pushed to the time when the enterprise purchases and activates
 * the application in the DingTalk service market and generates an order, and is inserted into the table open sync biz data.
 * sync Action is market service close, which means the service is closed due to order expiration or user refund.
 * Note: Only service shutdowns due to refunds are currently being pushed.
 */
@Setter
@Getter
@ToString
@DingTalkEvent(value = DingTalkEventTag.SYNC_HTTP_PUSH_HIGH, action = DingTalkSyncAction.MARKET_SERVICE_CLOSE)
public class SyncHttpMarketServiceCloseEvent extends BaseOrderEvent {
    /**
     * Event Type: subscription close
     */
    private String eventType;

    /**
     * Close Type:
     * 1: upgrade off,
     * 2: Closing due to expiration,
     * 3: Refund closed,
     * 4: Other off,
     * Note: Currently only push 3 refunds are closed.
     */
    private Integer closeType;

    private Integer pushType;

    /**
     * Refund slip id, the unique identifier of the refund. not returning
     */
    private String refundId;

    /**
     * Open type.
     * Note: At present, the message for subscription activation only pushes the activation type as "renewal and
     * change configuration activation", and the value is: 3.
     */
    private Integer openType;
}
