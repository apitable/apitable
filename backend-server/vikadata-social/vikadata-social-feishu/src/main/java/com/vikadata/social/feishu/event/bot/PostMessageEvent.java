package com.vikadata.social.feishu.event.bot;

import com.vikadata.social.feishu.annotation.FeishuMessageEvent;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

/**
 * <p>
 * 富文本和 post 消息
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/26 23:49
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
