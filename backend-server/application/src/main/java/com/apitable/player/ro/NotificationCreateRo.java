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

package com.apitable.player.ro;

import cn.hutool.json.JSONObject;
import com.apitable.shared.constants.NotificationConstants;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import lombok.Data;

/**
 * <p>
 * User notification list parameters.
 * </p>
 */
@Data
@Schema(description = "User notification list parameters")
public class NotificationCreateRo {

    @Schema(description = "ID of the notified user (optional)")
    private List<String> toUserId;

    @Schema(description = "Either the member ID or to User Id of the notified user (optional)")
    private List<String> toMemberId;

    @Schema(description = "Either the organizational unit ID or to User ID of the notified user "
        + "(optional)")
    private List<String> toUnitId;

    @Schema(description = "Send the notification user ID, and the system notifies the user as 0 "
        + "(optional)", example = "1261273764218")
    private String fromUserId = "0";

    @Schema(description = "Node ID (optional)", example = "nod10")
    private String nodeId = null;

    @Schema(description = "Space ID (optional)", example = "spcHKrd0liUcl")
    private String spaceId = null;

    @NotBlank
    @Schema(description = "Template ID", requiredMode = RequiredMode.REQUIRED, example = "tplxx")
    private String templateId;

    @Schema(description = "Additional fields for notification (optional)"
        + NotificationConstants.BODY_REQUEST_DESC,
        example = NotificationConstants.BODY_REQUEST_EXAMPLE)
    private JSONObject body;

    @Schema(description = "Version number (optional)", example = "v0.12.1.release")
    private String version;

    @Schema(description = "Expiration time (optional) accurate to milliseconds",
        example = "1614587900000")
    private String expireAt;

    @Schema(description = "Notification ID (optional)", example = "1614587900000")
    private String notifyId = null;
}
