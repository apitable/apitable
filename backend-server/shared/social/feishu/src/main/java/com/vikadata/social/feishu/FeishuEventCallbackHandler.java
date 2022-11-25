package com.vikadata.social.feishu;

import com.vikadata.social.feishu.event.BaseEvent;

/**
 * Feishu Event callback handler interface
 */
public interface FeishuEventCallbackHandler<T extends BaseEvent> {

    /**
     * handler
     *
     * @param event Feishu event
     * @return result
     */
    Object doHandle(T event);
}
