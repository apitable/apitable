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
 * <p>
 * Notification Template
 * </p>
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
