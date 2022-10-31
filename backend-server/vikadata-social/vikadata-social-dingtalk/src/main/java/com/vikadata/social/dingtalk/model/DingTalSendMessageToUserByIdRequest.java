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
public class DingTalSendMessageToUserByIdRequest {

    private Long agentId;

    private String templateId;

    private String useridList;

    private String data;
}
