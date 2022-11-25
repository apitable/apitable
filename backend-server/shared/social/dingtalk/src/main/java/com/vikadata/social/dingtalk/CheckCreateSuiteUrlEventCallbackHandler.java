package com.vikadata.social.dingtalk;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.social.dingtalk.event.CheckCreateSuiteUrlEvent;

import static com.vikadata.social.dingtalk.constants.DingTalkConst.DING_TALK_CALLBACK_SUCCESS;

/**
 * APP Tick event handling
 */
@Slf4j
public class CheckCreateSuiteUrlEventCallbackHandler implements DingTalkEventCallbackHandler<CheckCreateSuiteUrlEvent> {
   
    @Override
    public Object doHandle(String suiteId, CheckCreateSuiteUrlEvent event) {
        return DING_TALK_CALLBACK_SUCCESS;
    }
}
