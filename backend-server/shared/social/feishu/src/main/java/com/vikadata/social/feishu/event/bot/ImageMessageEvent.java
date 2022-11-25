package com.vikadata.social.feishu.event.bot;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.annotation.FeishuMessageEvent;

/**
 * picture message
 */
@Setter
@Getter
@ToString
@FeishuMessageEvent("image")
public class ImageMessageEvent extends BaseMessageEvent {

    private String imageHeight;

    private String imageWidth;

    private String imageKey;
}
