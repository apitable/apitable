package com.vikadata.social.feishu.event.app;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.annotation.FeishuEvent;
import com.vikadata.social.feishu.event.BaseEvent;

/**
 * app uninstall event
 */
@Setter
@Getter
@ToString
@FeishuEvent("app_uninstalled")
public class AppUninstalledEvent extends BaseEvent {

}
