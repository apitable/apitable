package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

/**
 * 批量发送消息结果
 *
 * @author Shawn Deng
 * @date 2020-12-03 00:11:46
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
