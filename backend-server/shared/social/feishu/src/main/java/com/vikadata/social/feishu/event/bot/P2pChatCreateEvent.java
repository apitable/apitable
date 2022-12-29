package com.vikadata.social.feishu.event.bot;

import lombok.Getter;
import lombok.Setter;

import com.vikadata.social.feishu.annotation.FeishuEvent;
import com.vikadata.social.feishu.event.BaseEvent;
import com.vikadata.social.feishu.event.HasNameUser;
import com.vikadata.social.feishu.event.UserInfo;

/**
 * User-bot session is created for the first time
 */
@Setter
@Getter
@FeishuEvent("p2p_chat_create")
public class P2pChatCreateEvent extends BaseEvent {

    private String chatId;

    private UserInfo operator;

    private HasNameUser user;
}
