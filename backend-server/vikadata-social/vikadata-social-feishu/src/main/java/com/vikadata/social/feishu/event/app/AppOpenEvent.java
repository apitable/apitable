package com.vikadata.social.feishu.event.app;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.annotation.FeishuEvent;
import com.vikadata.social.feishu.event.BaseEvent;
import com.vikadata.social.feishu.event.UserInfo;

/**
 * Open the app for the first time
 */
@Setter
@Getter
@ToString
@FeishuEvent("app_open")
public class AppOpenEvent extends BaseEvent {

    private List<UserInfo> applicants;

    private UserInfo installer;

    private UserInfo installerEmployee;
}
