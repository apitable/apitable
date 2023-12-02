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

package com.apitable.space.vo;

import com.apitable.control.infrastructure.ExportLevelEnum;
import com.apitable.shared.support.serializer.EmptyBooleanSerializer;
import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullNumberSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import com.apitable.space.ro.SpaceSecuritySettingRo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Space global feature.
 * </p>
 * The field must be consistent with the received parameters of the change interface
 *
 * @author Shawn Deng
 * @see SpaceSecuritySettingRo SpaceSecuritySettingRo
 */
@Data
@Schema(description = "Space Global Feature")
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class SpaceGlobalFeature {

    @Schema(description = "Whether file is allowed to be shared with others", example = "true")
    @JsonSerialize(nullsUsing = EmptyBooleanSerializer.class)
    private Boolean fileSharable;

    @Schema(description = "Whether space is allowed to invite others", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean invitable;

    @Schema(description = "Whether node is allowed to export", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean nodeExportable;

    @Schema(description = "Whether attachment is allowed to download", example = "true")
    @JsonSerialize(nullsUsing = EmptyBooleanSerializer.class)
    private Boolean allowDownloadAttachment;

    @Schema(description = "Whether data is allowed to copy", example = "true")
    @JsonSerialize(nullsUsing = EmptyBooleanSerializer.class)
    private Boolean allowCopyDataToExternal;

    @Schema(description = "Whether space is allowed others user join", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean joinable;

    @Schema(description = "Whether social platform is allowed to integrate", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean socialOpen;

    @Schema(description = "Whether member mobile is allowed to show", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean mobileShowable;

    @Schema(description = "Whether watermark is allowed to enable", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean watermarkEnable;

    @JsonIgnore
    private Boolean blackSpace;

    @JsonIgnore
    private Boolean ban;

    @Schema(description = "certification level name", example = "basic/senior", hidden = true)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String certification;

    @Schema(description = "Set permissions required to export files",
        example = "2")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer exportLevel;

    @Schema(description = "Whether organization isolate is open", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean orgIsolated;

    @Schema(description = "Whether to forbid the management operations of members in the root "
        + "directory", example = "false")
    @JsonSerialize(nullsUsing = EmptyBooleanSerializer.class)
    private Boolean rootManageable;

    /**
     * exportLevelOrDefault.
     */
    public Integer exportLevelOrDefault() {
        if (exportLevel != null) {
            return exportLevel;
        }

        // Compatible with older versions
        return Boolean.TRUE.equals(nodeExportable)
            ? ExportLevelEnum.LEVEL_BEYOND_EDIT.getValue()
            : ExportLevelEnum.LEVEL_CLOSED.getValue();
    }

    public Boolean rootManageableOrDefault() {
        return rootManageable != null ? rootManageable : true;
    }
}
