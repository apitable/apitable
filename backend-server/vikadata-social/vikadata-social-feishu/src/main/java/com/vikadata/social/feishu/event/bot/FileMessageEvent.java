package com.vikadata.social.feishu.event.bot;

import com.vikadata.social.feishu.annotation.FeishuMessageEvent;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 文件消息
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/26 23:48
 */
@Setter
@Getter
@ToString
@FeishuMessageEvent("file")
public class FileMessageEvent extends BaseMessageEvent {

    private String fileKey;
}
