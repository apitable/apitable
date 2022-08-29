package com.vikadata.social.feishu.event.bot;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.vikadata.social.feishu.annotation.FeishuEvent;
import com.vikadata.social.feishu.event.BaseEvent;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 消息卡片基础属性
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/24 11:09
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
