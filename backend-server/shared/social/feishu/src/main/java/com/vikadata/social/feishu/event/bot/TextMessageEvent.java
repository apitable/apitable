package com.vikadata.social.feishu.event.bot;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.annotation.FeishuMessageEvent;

/**
 * text message
 */
@Setter
@Getter
@ToString
@FeishuMessageEvent("text")
public class TextMessageEvent extends BaseMessageEvent {

    private String text;

    private String textWithoutAtBot;
}
