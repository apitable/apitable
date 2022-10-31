package com.vikadata.social.feishu.card;

/**
 * message interface
 */
public interface Message {

    String getMsgType();

    String getContentKey();

    Object getContent();

    default String getRootId() {
        return null;
    }
}
