package com.vikadata.social.service.dingtalk.event;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventHandler;
import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventListener;
import com.vikadata.social.dingtalk.event.order.SyncHttpMarketOrderEvent;
import com.vikadata.social.dingtalk.event.order.SyncHttpMarketServiceCloseEvent;

import static com.vikadata.social.dingtalk.constants.DingTalkConst.DING_TALK_CALLBACK_SUCCESS;

/**
 * <p> 
 * 事件订阅 -- 应用市场订单
 * </p> 
 * @author zoe zheng 
 * @date 2021/10/25 15:07
 */
@DingTalkEventHandler
@Slf4j
public class MarketOrderEventHandler {

    /**
     * 应用市场开通付费应用
     *
     * @param bizId 订单的orderid。
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onMarketOrderEvent(String bizId, SyncHttpMarketOrderEvent event) {
        log.info("收到钉钉推送订单事件:[{}:{}:{}:{}],不处理", event.getEventType(), event.getSyncAction(), event.getCorpId(),
                bizId);
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * 应用市场服务关闭通知
     * 该订单对应的用户操作。
     * syncAction为market_service_close表示因订单到期或者用户退款等导致的服务关闭。
     * 注意 目前仅推送因退款导致的服务关闭。
     *
     * @param bizId 订单的orderid
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onMarketServiceCloseEvent(String bizId, SyncHttpMarketServiceCloseEvent event) {
        log.info("收到钉钉推送服务关闭事件:[{}:{}:{}:{}],不处理", event.getEventType(), event.getSyncAction(), event.getCorpId(),
                bizId);
        return DING_TALK_CALLBACK_SUCCESS;
    }
}
