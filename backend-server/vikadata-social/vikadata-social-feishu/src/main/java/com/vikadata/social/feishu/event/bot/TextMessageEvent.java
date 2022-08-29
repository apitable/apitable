package com.vikadata.social.feishu.event.bot;

import com.vikadata.social.feishu.annotation.FeishuMessageEvent;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 文本消息
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/24 11:10
 */
@Setter
@Getter
@ToString
@FeishuMessageEvent("text")
public class TextMessageEvent extends BaseMessageEvent {

    private String text;

    private String textWithoutAtBot;
}
