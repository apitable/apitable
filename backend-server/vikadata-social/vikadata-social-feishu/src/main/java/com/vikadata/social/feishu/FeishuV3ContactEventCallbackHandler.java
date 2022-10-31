package com.vikadata.social.feishu;

import com.vikadata.social.feishu.event.contact.v3.BaseV3ContactEvent;

/**
 * Event callback handler interface
 */
public interface FeishuV3ContactEventCallbackHandler<T extends BaseV3ContactEvent> {

    /**
     * handler
     * @param event Feishu event
     * @return process result
     */
    Object doHandle(T event);
}
