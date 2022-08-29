package com.vikadata.social.feishu.event.bot;

import com.vikadata.social.feishu.annotation.FeishuMessageEvent;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 图片消息
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/26 23:47
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
