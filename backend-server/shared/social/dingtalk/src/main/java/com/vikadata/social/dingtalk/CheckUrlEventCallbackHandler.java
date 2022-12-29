package com.vikadata.social.dingtalk;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.social.dingtalk.event.CheckUrlEvent;

import static com.vikadata.social.dingtalk.constants.DingTalkConst.DING_TALK_CALLBACK_SUCCESS;

/**
 * APP Tick event handling
 */
@Slf4j
public class CheckUrlEventCallbackHandler implements DingTalkEventCallbackHandler<CheckUrlEvent> {
   
    @Override
    public Object doHandle(String suiteId, CheckUrlEvent event) {
        return DING_TALK_CALLBACK_SUCCESS;
    }
}
