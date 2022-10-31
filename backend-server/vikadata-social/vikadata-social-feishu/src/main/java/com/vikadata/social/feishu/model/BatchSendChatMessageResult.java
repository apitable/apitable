package com.vikadata.social.feishu.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Batch send message results
 */
@Getter
@Setter
@ToString
public class BatchSendChatMessageResult {

    private List<String> invalidDepartmentIds;

    private List<String> invalidOpenIds;

    private List<String> invalidUserIds;

    private String messageId;
}
