package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 异步发送工作通知
 * </p>
 * @author zoe zheng
 * @date 2021/5/14 3:20 下午
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
