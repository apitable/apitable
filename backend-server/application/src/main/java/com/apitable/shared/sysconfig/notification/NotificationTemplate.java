/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.shared.sysconfig.notification;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * Notification Template.
 *
 * @author zoe
 */
@Data
public class NotificationTemplate {
    /**
     * id.
     */
    private String id;
    /**
     * canJump.
     */
    private boolean canJump;
    /**
     * to user tag.
     */
    private String toTag;
    /**
     * format string.
     */
    private String formatString;
    /**
     * whether to show in notification center.
     */
    @JsonProperty("is_notification")
    private boolean isNotification;
    /**
     * whether to send mobile notification.
     */
    @JsonProperty("is_mobile")
    private boolean isMobile;
    /**
     * whether to send browser notification.
     */
    @JsonProperty("is_browser")
    private boolean isBrowser;
    /**
     * is component.
     */
    @JsonProperty("is_component")
    private boolean isComponent;
    /**
     * whether to send email notification.
     */
    @JsonProperty("is_mail")
    private boolean isMail;
    /**
     * jump url.
     */
    private String url;
    /**
     * notification type.
     */
    private String notificationsType;
    /**
     * mail subject.
     */
    private String mailTemplateSubject;
    /**
     * frequency limit.
     */
    private Integer frequency;
    /**
     * redirect url.
     */
    private String redirectUrl;
}
