package com.vikadata.social.dingtalk;

import com.vikadata.social.dingtalk.event.BaseEvent;

/**
 * DingTalk Event callback handler interface
 */
public interface DingTalkEventCallbackHandler<T extends BaseEvent> {

    Object doHandle(String agentId, T event);
}
