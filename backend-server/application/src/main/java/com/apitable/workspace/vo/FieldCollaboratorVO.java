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

import com.apitable.shared.support.serializer.NullArraySerializer;
import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

/**
 * <p>
 * Data Table Field Role Information View.
 * </p>
 */
@Data
@Schema(description = "Data Table Field Permission View")
public class FieldCollaboratorVO {

    @Schema(description = "Whether to open", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean enabled;

    @Deprecated
    @Schema(description = "Role Member List")
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<FieldRoleMemberVo> members;

    @Schema(description = "Role Org Unit List")
    private List<FieldRole> roles;

    @Schema(description = "Data Table Field Role Configuration Attribute")
    private FieldRoleSetting setting;
}
