package com.vikadata.social.dingtalk;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.social.dingtalk.event.CheckUpdateSuiteUrlEvent;

import static com.vikadata.social.dingtalk.constants.DingTalkConst.DING_TALK_CALLBACK_SUCCESS;

@Slf4j
public class CheckUpdateSuiteUrlEventCallbackHandler implements DingTalkEventCallbackHandler<CheckUpdateSuiteUrlEvent> {
    
    @Override
    public Object doHandle(String suiteId, CheckUpdateSuiteUrlEvent event) {
        return DING_TALK_CALLBACK_SUCCESS;
    }
}
