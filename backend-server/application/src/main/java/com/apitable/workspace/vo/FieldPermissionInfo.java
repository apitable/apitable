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

package com.apitable.workspace.vo;

import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Field Permission View Information.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Schema(description = "Field Permission View Information")
public class FieldPermissionInfo {

    @Schema(description = "Field ID", example = "fldUQZGaNqSg2")
    private String fieldId;

    @Schema(description = "Data Table Field Role Configuration Attribute")
    private FieldRoleSetting setting;

    @Schema(description = "Whether you have permission", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean hasRole;

    @Schema(description = "Role", example = "true")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String role;

    @Schema(description = "Whether column roles can be managed", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean manageable;

    @Schema(description = "Field permission set")
    private FieldPermission permission;
}
