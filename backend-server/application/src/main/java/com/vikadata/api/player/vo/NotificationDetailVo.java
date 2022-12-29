package com.vikadata.api.player.vo;

import cn.hutool.json.JSONObject;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;

import com.vikadata.api.shared.constants.NotificationConstants;
import com.vikadata.api.shared.support.serializer.ImageSerializer;
import com.vikadata.api.shared.support.serializer.NullNumberSerializer;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * User message notification list
 * </p>
 */
@Data
@Builder(toBuilder = true)
@ApiModel("User message notification list")
public class NotificationDetailVo {
    @ApiModelProperty(value = "Message ID", example = "1261273764218")
    private String id;

    @ApiModelProperty(value = "Read 1 Read, 0 Unread", example = "1")
    private Integer isRead;

    @ApiModelProperty(value = "Notification Type", example = "system")
    private String notifyType;

    @ApiModelProperty(value = "Creation time", example = "2020-03-18 15:29:59")
    private String createdAt;

    @ApiModelProperty(value = "Update time", example = "2020-03-18 15:29:59")
    private String updatedAt;

    @Deprecated
    @ApiModelProperty(value = "Notified user ID", example = "1261273764218")
    private String toUserId;

    @ApiModelProperty(value = "Notified user uuid", example = "aaaabb")
    private String toUuid;

    @ApiModelProperty(value = "Send notification to users")
    private PlayerBaseVo fromUser;

    @ApiModelProperty(value = "Notice content")
    private NotifyBody notifyBody;

    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    @ApiModelProperty(value = "Number of notification lines of the day")
    private Integer rowNo;

    @ApiModelProperty(value = "Notification template ID")
    private String templateId;

    @Data
    @Builder
    @ApiModel("Notice content")
    public static class NotifyBody {
        @ApiModelProperty(value = "Send notification to users", example = "Zoe has @ you 3 times in customizing the vika table")
        @Deprecated
        private String template;

        @ApiModelProperty(value = "Send notification to users", example = "Space Message")
        private String title;

        @ApiModelProperty(value = "Node Information")
        private Node node;

        @ApiModelProperty(value = "spatial information ")
        private Space space;

        @ApiModelProperty(value = "Notify additional fields" + NotificationConstants.BODY_EXTRAS_DESC,
                example = NotificationConstants.BODY_EXTRAS_EXAMPLE)
        private JSONObject extras;

        @ApiModelProperty(value = "Notify Jump")
        private Intent intent;

    }

    @Data
    @Builder
    @ApiModel("Notify Jump")
    public static class Intent {
        @ApiModelProperty(value = "Jump link", example = "https://vika.cn")
        private String url;
    }

    @Data
    @Builder
    @ApiModel("node")
    public static class Node {
        @ApiModelProperty(value = "Node ID")
        private String nodeId;

        @ApiModelProperty(value = "Node Information")
        private String nodeName;

        @JsonSerialize(nullsUsing = NullStringSerializer.class)
        @ApiModelProperty(value = "Node icon")
        private String icon;
    }

    @Data
    @Builder
    @ApiModel("space")
    public static class Space {
        @ApiModelProperty(value = "Space ID")
        private String spaceId;

        @ApiModelProperty(value = "Space name")
        private String spaceName;

        @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
        @ApiModelProperty(value = "Space avatar")
        private String logo;
    }

}
