package com.vikadata.social.feishu.event.bot;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.vikadata.social.feishu.annotation.FeishuEvent;
import com.vikadata.social.feishu.event.BaseEvent;
import lombok.Getter;
import lombok.Setter;

/**
 * 机器人被邀请加入群聊时事件
 * @author Shawn Deng
 * @date 2020-12-23 19:36:10
 */
@Setter
@Getter
@FeishuEvent("add_bot")
public class AddBotEvent extends BaseEvent {

    private String chatName;

    private String chatOwnerEmployeeId;

    private String chatOwnerName;

    private String chatOwnerOpenId;

    private String openChatId;

    private String operatorEmployeeId;

    private String operatorName;

    private String operatorOpenId;

    @JsonProperty("owner_is_bot")
    private boolean ownerIsBot;

    @JsonProperty("chat_i18n_names")
    private ChatI18nNames chatI18nNames;

    @Setter
    @Getter
    public static class ChatI18nNames {

        private String enUs;
        private String zhCn;
    }
}
