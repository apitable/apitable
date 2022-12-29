package com.vikadata.social.feishu.event.bot;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.annotation.FeishuEvent;
import com.vikadata.social.feishu.event.BaseEvent;

/**
 * Message Card Basic Properties
 */
@Setter
@Getter
@ToString
@FeishuEvent("message")
public class BaseMessageEvent extends BaseEvent {

    public static final String PRIVATE_CHAT_TYPE = "private";

    public static final String GROUP_CHAT_TYPE = "group";

    private String tenantKey;

    private String rootId;

    private String parentId;

    private String openChatId;

    private String chatType;

    private String msgType;

    private String openId;

    private String openMessageId;

    @JsonProperty("is_mention")
    private boolean isMention;
}
