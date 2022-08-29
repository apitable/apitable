package com.vikadata.social.feishu.event.bot;

import com.vikadata.social.feishu.annotation.FeishuEvent;
import com.vikadata.social.feishu.event.BaseEvent;
import com.vikadata.social.feishu.event.HasNameUser;
import com.vikadata.social.feishu.event.UserInfo;
import lombok.Getter;
import lombok.Setter;

/**
 * 用户和机器人的会话首次被创建
 *
 * @author Shawn Deng
 * @date 2020-11-26 23:33:50
 */
@Setter
@Getter
@FeishuEvent("p2p_chat_create")
public class P2pChatCreateEvent extends BaseEvent {

    private String chatId;

    private UserInfo operator;

    private HasNameUser user;
}
