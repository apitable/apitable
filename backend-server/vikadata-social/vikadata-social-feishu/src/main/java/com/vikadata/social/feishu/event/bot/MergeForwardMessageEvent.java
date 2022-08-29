package com.vikadata.social.feishu.event.bot;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.vikadata.social.feishu.annotation.FeishuMessageEvent;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

/**
 * <p>
 * 合并转发消息内容
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/26 23:48
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
