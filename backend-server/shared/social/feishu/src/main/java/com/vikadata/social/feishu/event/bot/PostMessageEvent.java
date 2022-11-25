package com.vikadata.social.feishu.event.bot;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.annotation.FeishuMessageEvent;

/**
 * Rich text and post messages
 */
@Setter
@Getter
@ToString
@FeishuMessageEvent("post")
public class PostMessageEvent extends BaseMessageEvent {

    private String text;

    private String textWithoutAtBot;

    private String title;

    private List<String> imageKeys;
}
