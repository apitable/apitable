package com.vikadata.social.feishu.event.bot;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import com.vikadata.social.feishu.annotation.FeishuEvent;
import com.vikadata.social.feishu.event.BaseEvent;

/**
 * Event when a bot is invited to a group chat
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
