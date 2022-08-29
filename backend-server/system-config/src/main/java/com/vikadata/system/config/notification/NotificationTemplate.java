package com.vikadata.system.config.notification;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * 通知模版
 * @author Shawn Deng
 * @date 2021-11-11 15:34:16
 */
@Data
public class NotificationTemplate {
    private String id;

    private boolean canJump;

    private String toTag;

    private String formatString;

    @JsonProperty("is_notification")
    private boolean isNotification;

    @JsonProperty("is_mobile")
    private boolean isMobile;

    @JsonProperty("is_browser")
    private boolean isBrowser;

    @JsonProperty("is_component")
    private boolean isComponent;

    @JsonProperty("is_mail")
    private boolean isMail;

    private String url;

    private String notificationsType;

    private String mailTemplateSubject;

    private Integer frequency;
}
