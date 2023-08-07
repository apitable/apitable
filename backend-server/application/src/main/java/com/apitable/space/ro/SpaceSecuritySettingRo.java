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

import com.apitable.shared.validator.ExportLevelMatch;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * <p>
 * Space Management - Permission and Security Settings Request Parameters.
 * </p>
 */
@Data
@Schema(description = "Space Management - Permission and Security Settings Request Parameters")
public class SpaceSecuritySettingRo {

    // Allow file sharing (default)
    @Schema(description = "Allow file share", example = "true")
    private Boolean fileSharable;

    // Allow non administrators to invite members (allowed by default)
    @Schema(description = "Invitable status of all staff", example = "true")
    private Boolean invitable;

    // Allow to apply for joining the space station (not allowed by default)
    @Schema(description = "Allow others to apply for space status", example = "false")
    private Boolean joinable;

    // Allow read-only roles to download attachments (allowed by default)
    @Schema(description = "Allow read-only members to download attachments", example = "true")
    private Boolean allowDownloadAttachment;

    // Allow data replication offsite (default)
    @Schema(description = "Allow members to copy data offsite", example = "true")
    private Boolean allowCopyDataToExternal;

    // Display member mobile number (not displayed by default)
    @Schema(description = "Display member's mobile number", example = "false")
    private Boolean mobileShowable;

    // Global watermark on status (not displayed by default)
    @Schema(description = "Global Watermark On Status", example = "false")
    private Boolean watermarkEnable;

    // blackSpace The attribute is not mapped and is operated by GM

    // Permissions to export
    @Schema(description = "Member permission levels that can be exported", example = "2")
    @ExportLevelMatch
    private Integer exportLevel;

    // Address book isolation (not enabled by default)
    @Schema(description = "Address book isolation", example = "false")
    private Boolean orgIsolated;

    // Root directory operation permission control
    @Schema(description = "Whether to disable the 「management」 operation of the root directory of"
        + " ordinary members", example = "false")
    private Boolean rootManageable;
}
