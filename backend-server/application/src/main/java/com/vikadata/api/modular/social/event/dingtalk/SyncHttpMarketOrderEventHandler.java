package com.vikadata.api.modular.social.event.dingtalk;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.social.service.IDingTalkIsvEventService;
import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventHandler;
import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventListener;
import com.vikadata.social.dingtalk.event.order.SyncHttpMarketOrderEvent;
import com.vikadata.social.dingtalk.event.order.SyncHttpMarketServiceCloseEvent;

import static com.vikadata.social.dingtalk.constants.DingTalkConst.DING_TALK_CALLBACK_SUCCESS;

/**
 * <p> 
 * Event subscription -- application market order
 * </p>
 */
@DingTalkEventHandler
@Slf4j
public class SyncHttpMarketOrderEventHandler {

    @Resource
    private IDingTalkIsvEventService iDingTalkIsvEventService;

    /**
     * Application market opens paid applications
     *
     * @param bizId Order id of the order
     * @param event Event content
     * @return Response content
     */
    @DingTalkEventListener
    public Object onMarketOrderEvent(String bizId, SyncHttpMarketOrderEvent event) {
        log.info("Received the DingTalk push order event:[{}:{}:{}:{}]", event.getEventType(), event.getSyncAction(), event.getCorpId(), bizId);
        iDingTalkIsvEventService.handleMarketOrderEvent(event);
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * Received the DingTalk push service shutdown event
     *
     * @param bizId Order id of the order
     * @param event Event content
     * @return Response content
     */
    @DingTalkEventListener
    public Object onMarketServiceCloseEvent(String bizId, SyncHttpMarketServiceCloseEvent event) {
        log.info("Received the Ding Talk push service shutdown event:[{}:{}:{}:{}]", event.getEventType(), event.getSyncAction(), event.getCorpId(),
                event.getOrderId());
        iDingTalkIsvEventService.handleMarketServiceClosedEvent(event);
        return DING_TALK_CALLBACK_SUCCESS;
    }
}
