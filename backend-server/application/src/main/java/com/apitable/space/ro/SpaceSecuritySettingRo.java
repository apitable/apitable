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

package com.apitable.space.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.apitable.shared.validator.ExportLevelMatch;

/**
 * <p>
 * Space Management - Permission and Security Settings Request Parameters
 * </p>
 */
@Data
@ApiModel("Space Management - Permission and Security Settings Request Parameters")
public class SpaceSecuritySettingRo {

    // Allow file sharing (default)
    @ApiModelProperty(value = "Allow file share", example = "true", position = 1)
    private Boolean fileSharable;

    // Allow non administrators to invite members (allowed by default)
    @ApiModelProperty(value = "Invitable status of all staff", example = "true", position = 2)
    private Boolean invitable;

    // Allow to apply for joining the space station (not allowed by default)
    @ApiModelProperty(value = "Allow others to apply for space status", example = "false", position = 3)
    private Boolean joinable;

    // Allow to export the (allowed by default)
    @ApiModelProperty(value = "All members of the node can be exported", example = "true", position = 4)
    @Deprecated
    private Boolean nodeExportable;

    // Allow read-only roles to download attachments (allowed by default)
    @ApiModelProperty(value = "Allow read-only members to download attachments", example = "true", position = 5)
    private Boolean allowDownloadAttachment;

    // Allow data replication offsite (default)
    @ApiModelProperty(value = "Allow members to copy data offsite", example = "true", position = 6)
    private Boolean allowCopyDataToExternal;

    // Display member mobile number (not displayed by default)
    @ApiModelProperty(value = "Display member's mobile number", example = "false", position = 7)
    private Boolean mobileShowable;

    // Global watermark on status (not displayed by default)
    @ApiModelProperty(value = "Global Watermark On Status", example = "false", position = 8)
    private Boolean watermarkEnable;

    // blackSpace The attribute is not mapped and is operated by GM

    // Permissions to export
    @ApiModelProperty(value = "Member permission levels that can be exported",
            notes = "0 Prohibit export or permission 1 Read only and above/ 2 Editable above/3 The managed members can export the table or view in the directory to the local",
            example = "2", position = 9)
    @ExportLevelMatch
    private Integer exportLevel;

    // Address book isolation (not enabled by default)
    @ApiModelProperty(value = "Address book isolation", example = "false", position = 10)
    private Boolean orgIsolated;

    // Root directory operation permission control
    @ApiModelProperty(value = "Whether to disable the 「management」 operation of the root directory of ordinary members", example = "false", position = 11)
    private Boolean rootManageable;
}
