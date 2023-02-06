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

package com.apitable.player.vo;

import cn.hutool.json.JSONObject;
import com.apitable.shared.support.serializer.LocalDateTimeToMilliSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;

import com.apitable.shared.constants.NotificationConstants;
import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.NullNumberSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;

import java.time.LocalDateTime;

/**
 * <p>
 * User message notification list.
 * </p>
 */
@Data
@Builder(toBuilder = true)
@ApiModel("User message notification list")
public class NotificationDetailVo {

    /**
     * Message ID.
     */
    @ApiModelProperty(value = "Message ID", example = "1261273764218")
    private String id;

    /**
     * is read.
     */
    @ApiModelProperty(value = "Read 1 Read, 0 Unread", example = "1")
    private Integer isRead;

    /**
     * Notification Type.
     */
    @ApiModelProperty(value = "Notification Type", example = "system")
    private String notifyType;

    /**
     * Creation time.
     */
    @ApiModelProperty(value = "Creation time", example = "1573561644000")
    @JsonSerialize(using = LocalDateTimeToMilliSerializer.class)
    private LocalDateTime createdAt;

    /**
     * Update time.
     */
    @ApiModelProperty(value = "Update time", example = "1573561644000")
    @JsonSerialize(using = LocalDateTimeToMilliSerializer.class)
    private LocalDateTime updatedAt;

    /**
     * Notified user ID.
     */
    @Deprecated
    @ApiModelProperty(value = "Notified user ID", example = "1261273764218")
    private String toUserId;

    /**
     * Notified user uuid.
     */
    @ApiModelProperty(value = "Notified user uuid", example = "aaaabb")
    private String toUuid;

    /**
     * Send notification to users.
     */
    @ApiModelProperty(value = "Send notification to users")
    private PlayerBaseVo fromUser;

    /**
     * Notice content.
     */
    @ApiModelProperty(value = "Notice content")
    private NotifyBody notifyBody;

    /**
     * Number of notification lines of the da.
     */
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    @ApiModelProperty(value = "Number of notification lines of the day")
    private Integer rowNo;

    /**
     * Notification template ID.
     */
    @ApiModelProperty(value = "Notification template ID")
    private String templateId;

    @Data
    @Builder
    @ApiModel("Notice content")
    public static class NotifyBody {

        /**
         * Send notification to users.
         */
        @ApiModelProperty(value = "Send notification to users")
        @Deprecated
        private String template;

        /**
         * Send notification to user.
         */
        @ApiModelProperty(value = "Send notification to users")
        private String title;

        /**
         * Node Information.
         */
        @ApiModelProperty(value = "Node Information")
        private Node node;

        /**
         * spatial information.
         */
        @ApiModelProperty(value = "spatial information ")
        private Space space;

        /**
         * Notify additional fields.
         */
        @ApiModelProperty(value = "Notify additional fields"
            + NotificationConstants.BODY_EXTRAS_DESC,
            example = NotificationConstants.BODY_EXTRAS_EXAMPLE)
        private JSONObject extras;

        /**
         * Notify Jump.
         */
        @ApiModelProperty(value = "Notify Jump")
        private Intent intent;

    }

    @Data
    @Builder
    @ApiModel("Notify Jump")
    public static class Intent {

        /**
         * Jump link.
         */
        @ApiModelProperty(value = "Jump link", example = "https://apitable.com")
        private String url;
    }

    @Data
    @Builder
    @ApiModel("node")
    public static class Node {

        /**
         * Node ID.
         */
        @ApiModelProperty(value = "Node ID")
        private String nodeId;

        /**
         * Node Information.
         */
        @ApiModelProperty(value = "Node Information")
        private String nodeName;

        /**
         * Node icon.
         */
        @JsonSerialize(nullsUsing = NullStringSerializer.class)
        @ApiModelProperty(value = "Node icon")
        private String icon;
    }

    @Data
    @Builder
    @ApiModel("space")
    public static class Space {

        /**
         * Space ID.
         */
        @ApiModelProperty(value = "Space ID")
        private String spaceId;

        /**
         * Space name.
         */
        @ApiModelProperty(value = "Space name")
        private String spaceName;

        /**
         * Space avatar.
         */
        @JsonSerialize(nullsUsing = NullStringSerializer.class,
            using = ImageSerializer.class)
        @ApiModelProperty(value = "Space avatar")
        private String logo;
    }

}
