package com.vikadata.social.service.dingtalk.event;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventHandler;
import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventListener;
import com.vikadata.social.dingtalk.event.order.SyncHttpMarketOrderEvent;
import com.vikadata.social.dingtalk.event.order.SyncHttpMarketServiceCloseEvent;

import static com.vikadata.social.dingtalk.constants.DingTalkConst.DING_TALK_CALLBACK_SUCCESS;

/**
 * Event Subscriptions -- Apply Marketplace Orders
 */
@DingTalkEventHandler
@Slf4j
public class MarketOrderEventHandler {

    /**
     * application market opens paid applications
     *
     * @param bizId The orderid of the order.
     * @param event event content
     * @return response content
     */
    @DingTalkEventListener
    public Object onMarketOrderEvent(String bizId, SyncHttpMarketOrderEvent event) {
        log.info("DingTalk push order event received: [{}:{}:{}:{}], not processed", event.getEventType(),
                event.getSyncAction(), event.getCorpId(),
                bizId);
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * App Market Service Shutdown Notification.
     * The user action corresponding to the order.
     * When sync Action is market service close, it means that the service is closed due to order expiration or user refund.
     * Note: Only service shutdowns due to refunds are currently being pushed.
     *
     * @param bizId orderid of the order
     * @param event event content
     * @return response content
     */
    @DingTalkEventListener
    public Object onMarketServiceCloseEvent(String bizId, SyncHttpMarketServiceCloseEvent event) {
        log.info("Received DingTalk push service shutdown event: [{}:{}:{}:{}], not processed", event.getEventType(),
                event.getSyncAction(), event.getCorpId(),
                bizId);
        return DING_TALK_CALLBACK_SUCCESS;
    }
}
