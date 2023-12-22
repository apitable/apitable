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

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import lombok.Data;

/**
 * <p>
 * Undo notification parameters.
 * </p>
 */
@Data
@Schema(description = "Undo notification parameters")
public class NotificationRevokeRo {

    @Schema(description = "Uuid of the notified user (optional)")
    private List<String> uuid;

    @Schema(description = "Space ID (optional, either uuid or space ID)", example = "spcHKrd0liUcl")
    protected String spaceId = null;

    @NotBlank(message = "Template ID cannot be empty")
    @Schema(description = "Template ID", requiredMode = RequiredMode.REQUIRED, example = "tplxx")
    private String templateId;

    @Schema(description = "Version number (optional)", example = "v0.12.1.release")
    private String version;

    @Schema(description = "Expiration time (optional) accurate to milliseconds",
        example = "1614587900000")
    private String expireAt;

    @Schema(description = "Undo type: 1 read, 2 delete, read by default", example = "1614587900000")
    private int revokeType = 1;
}
