package com.vikadata.social.wecom.handler;

import me.chanjar.weixin.cp.tp.message.WxCpTpMessageHandler;

import com.vikadata.social.wecom.constants.WeComIsvMessageType;
import com.vikadata.social.wecom.constants.WeComIsvMsgType;

/**
 * <p>
 * 企业微信第三方服务商回调通知消息处理
 * </p>
 * @author 刘斌华
 * @date 2022-01-05 14:21:18
 */
public interface WeComIsvMessageHandler extends WxCpTpMessageHandler {

    /**
     * 处理完当前逻辑后是否继续处理其他规则
     *
     * @return 处理完当前逻辑后是否继续处理其他规则。默认不处理
     * @author 刘斌华
     * @date 2022-01-05 14:26:26
     */
    default boolean next() {

        return false;

    }

    /**
     * 是否异步处理
     *
     * @return 是否异步处理。默认同步
     * @author 刘斌华
     * @date 2022-01-05 14:28:11
     */
    default boolean async() {

        return false;

    }

    /**
     * 处理顺序
     *
     * @return 处理顺序。越小越先处理
     * @author 刘斌华
     * @date 2022-01-05 14:29:31
     */
    default int order() {

        return 0;

    }

    /**
     * 是否为事件处理类型
     *
     * @return 是否为事件处理类型。默认不是
     * @author 刘斌华
     * @date 2022-01-19 10:46:21
     */
    default WeComIsvMsgType msgType() {

        return WeComIsvMsgType.INFO_TYPE;

    }

    /**
     * 要处理的信息类型
     *
     * @return 要处理的信息类型。为 {@code null} 则会处理所有类型
     * @author 刘斌华
     * @date 2022-01-05 14:26:26
     */
    WeComIsvMessageType messageType();

}
