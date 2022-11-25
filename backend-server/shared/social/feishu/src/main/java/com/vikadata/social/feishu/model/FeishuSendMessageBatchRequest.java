package com.vikadata.social.feishu.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Send messages in bulk
 */
@Setter
@Getter
@ToString
public class FeishuSendMessageBatchRequest {

    private List<String> departmentIds;

    private List<String> openIds;

    private List<String> userIds;

    private String msgType;

    private Object content;

    private Boolean updateMulti;

    private Object card;
}
