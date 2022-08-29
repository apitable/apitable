package com.vikadata.social.feishu.event.app;

import com.vikadata.social.feishu.annotation.FeishuEvent;
import com.vikadata.social.feishu.event.BaseEvent;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 应用卸载 事件
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/23 22:46
 */
@Setter
@Getter
@ToString
@FeishuEvent("app_uninstalled")
public class AppUninstalledEvent extends BaseEvent {

}
