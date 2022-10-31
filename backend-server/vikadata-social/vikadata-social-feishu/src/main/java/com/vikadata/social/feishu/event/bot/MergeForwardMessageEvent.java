package com.vikadata.social.feishu.event.bot;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.annotation.FeishuMessageEvent;

/**
 * Combine forwarded message content
 */
@Setter
@Getter
@ToString
@FeishuMessageEvent("merge_forward")
public class MergeForwardMessageEvent extends BaseMessageEvent {

    private String user;

    private List<Message> msgList;

    @Setter
    @Getter
    @ToString
    public static class Message {
        private String rootId;

        private String parentId;

        private String openChatId;

        private String msgType;

        private String openId;

        private String openMessageId;

        @JsonProperty("is_mention")
        private boolean isMention;

        private Long createTime;

        private String text;

        private String title;

        private String imageKey;
    }
}
