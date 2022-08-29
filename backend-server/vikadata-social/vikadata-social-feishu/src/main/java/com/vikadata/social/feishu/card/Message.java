package com.vikadata.social.feishu.card;

/**
 * 消息接口
 *
 * @author Shawn Deng
 * @date 2020-12-01 17:34:42
 */
public interface Message {

    String getMsgType();

    String getContentKey();

    Object getContent();

    default String getRootId() {
        return null;
    }
}
