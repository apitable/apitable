package com.vikadata.social.wecom.handler;

import me.chanjar.weixin.cp.tp.message.WxCpTpMessageHandler;

import com.vikadata.social.wecom.constants.WeComIsvMessageType;
import com.vikadata.social.wecom.constants.WeComIsvMsgType;

/**
 * Enterprise WeChat ISV callback notification message processing
 */
public interface WeComIsvMessageHandler extends WxCpTpMessageHandler {

    /**
     * Whether to continue processing other rules after processing the current logic
     * @return Whether to continue processing other rules after processing the current logic. Not processed by default
     */
    default boolean next() {

        return false;

    }

    /**
     * Whether to process asynchronously
     * @return Whether to process asynchronously. Sync by default
     */
    default boolean async() {

        return false;

    }

    /**
     * Processing order
     * @return processing order. The smaller the better
     */
    default int order() {

        return 0;

    }

    /**
     * Whether it is an event handling type
     * @return Whether it is an event handler type. Default is not
     */
    default WeComIsvMsgType msgType() {

        return WeComIsvMsgType.INFO_TYPE;

    }

    /**
     * type of information to process
     * @return The type of information to process. is {@code null} will handle all types
     */
    WeComIsvMessageType messageType();

}
