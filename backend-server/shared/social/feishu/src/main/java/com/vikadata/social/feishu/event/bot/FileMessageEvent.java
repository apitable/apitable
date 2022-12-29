package com.vikadata.social.feishu.event.bot;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.annotation.FeishuMessageEvent;

/**
 * file message
 */
@Setter
@Getter
@ToString
@FeishuMessageEvent("file")
public class FileMessageEvent extends BaseMessageEvent {

    private String fileKey;
}
