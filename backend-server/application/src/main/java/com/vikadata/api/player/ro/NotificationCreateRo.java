package com.vikadata.api.player.ro;

import java.util.List;

import javax.validation.constraints.NotBlank;

import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.shared.constants.NotificationConstants;

/**
 * <p>
 * User notification list parameters
 * </p>
 */
@Data
@ApiModel("User notification list parameters")
public class NotificationCreateRo {

    @ApiModelProperty(value = "ID of the notified user (optional)", position = 1)
    private List<String> toUserId;

    @ApiModelProperty(value = "Either the member ID or to User Id of the notified user (optional)", position = 2)
    private List<String> toMemberId;

    @ApiModelProperty(value = "Either the organizational unit ID or to User ID of the notified user (optional)", position = 12)
    private List<String> toUnitId;

    @ApiModelProperty(value = "Send the notification user ID, and the system notifies the user as 0 (optional)", example = "1261273764218", position = 3)
    private String fromUserId = "0";

    @ApiModelProperty(value = "Node ID (optional)", example = "nod10", position = 4)
    private String nodeId = null;

    @ApiModelProperty(value = "Space ID (optional)", example = "spcHKrd0liUcl", position = 5)
    private String spaceId = null;

    @NotBlank
    @ApiModelProperty(value = "Template ID", example = "user_filed", required = true, position = 6)
    private String templateId;

    @ApiModelProperty(value = "Additional fields for notification (optional)" + NotificationConstants.BODY_REQUEST_DESC,
            example = NotificationConstants.BODY_REQUEST_EXAMPLE, position = 7)
    private JSONObject body;

    @ApiModelProperty(value = "Version number (optional)", example = "v0.12.1.release", position = 8)
    private String version;

    @ApiModelProperty(value = "Expiration time (optional) accurate to milliseconds", example = "1614587900000", position = 9)
    private String expireAt;

    @ApiModelProperty(value = "Notification ID (optional)", example = "1614587900000", position = 10)
    private String notifyId = null;

    @ApiModelProperty(value = "Third party notification type (optional) platform (1: WeCom, 2: DingTalk, 3: Lark)", example = "2", position = 11)
    private Integer socialPlatformType;
}
