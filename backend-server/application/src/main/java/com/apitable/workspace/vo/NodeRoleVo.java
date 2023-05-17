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

import com.apitable.organization.vo.UnitMemberVo;
import com.apitable.organization.vo.UnitTagVo;
import com.apitable.organization.vo.UnitTeamVo;
import com.apitable.shared.support.serializer.NullArraySerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.util.List;
import lombok.Data;

/**
 * <p>
 * Node Role View.
 * </p>
 */
@Data
@Deprecated
@Schema(description = "Node Role View")
public class NodeRoleVo implements Serializable {

    private static final long serialVersionUID = -3532750242987274847L;

    @Schema(description = "Role", example = "manager")
    private String role;

    @Schema(description = "Department List")
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<UnitTeamVo> teams;

    @Schema(description = "Tag List")
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<UnitTagVo> tags;

    @Schema(description = "Member List")
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<UnitMemberVo> members;
}
