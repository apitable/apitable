package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 发送消息卡片 参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/12/2 10:56
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
