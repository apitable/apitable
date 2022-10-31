package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Send job notifications asynchronously
 */
@Setter
@Getter
@ToString
public class DingTalkAsyncSendCorpMessageRequest {

    private Long agentId;

    private String useridList;

    private Boolean toAllUser;

    private Object msg;
}
