package com.vikadata.api.modular.social.event.dingtalk;

import lombok.extern.slf4j.Slf4j;

import com.apitable.starter.social.dingtalk.autoconfigure.annotation.DingTalkEventHandler;
import com.apitable.starter.social.dingtalk.autoconfigure.annotation.DingTalkEventListener;
import com.vikadata.social.dingtalk.event.CheckUrlEvent;

/**
 * <p>
 * DingTalk
 * Event Subscription - Basic Event
 * </p>
 */
@DingTalkEventHandler
@Slf4j
public class DingTalkAppEventHandler {


    /**
     * User Activation
     *
     * @param event Event content
     * @return Response content
     */
    @DingTalkEventListener
    public Object onCheckUrl(String agentId, CheckUrlEvent event) {
        // The event push of DingTalk will not repeat
        return "";
    }
}
