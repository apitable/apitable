package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Send card message Parameters
 */
@Setter
@Getter
@ToString
public class FeishuSendMessageRequest {

    private String openId;

    private String chatId;

    private String userId;

    private String email;

    private String rootId;

    private String msgType;

    private Object content;

    private Boolean updateMulti;

    private Object card;
}
