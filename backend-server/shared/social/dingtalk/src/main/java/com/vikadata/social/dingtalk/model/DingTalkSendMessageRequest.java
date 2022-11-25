package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * User Info
 */
@Setter
@Getter
@ToString
public class DingTalkSendMessageRequest {
    /**
     * ID of the group session
     */
    private String chatid;

    /**
     * Message content, up to 2048 bytes
     */
    private Object msg;
}
