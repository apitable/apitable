package com.vikadata.social.feishu.event.app;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.annotation.FeishuEvent;
import com.vikadata.social.feishu.event.BaseEvent;
import com.vikadata.social.feishu.event.UserInfo;

/**
 * app deactivation event
 */
@Setter
@Getter
@ToString
@FeishuEvent("app_status_change")
public class AppStatusChangeEvent extends BaseEvent {

    public static final String STATUS_START_BY_TENANT = "start_by_tenant";

    public static final String STATUS_STOP_BY_TENANT = "stop_by_tenant";

    public static final String STATUS_STOP_BY_PLATFORM = "stop_by_platform";

    private String status;

    private UserInfo operator;
}
