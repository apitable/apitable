package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

/**
 * <p>
 * 批量发送消息
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/12/2 11:07
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
