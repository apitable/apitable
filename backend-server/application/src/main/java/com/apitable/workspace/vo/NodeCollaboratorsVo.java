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
import com.apitable.shared.support.serializer.NullArraySerializer;
import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.util.List;
import lombok.Data;

/**
 * <p>
 * Node collaborator view.
 * </p>
 */
@Data
@Schema(description = "Node Role Information View")
public class NodeCollaboratorsVo implements Serializable {

    private static final long serialVersionUID = 5137772572237877951L;

    @Schema(description = "Current node permission mode", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean extend;

    @Schema(description = "Space administrator list")
    private List<UnitMemberVo> admins;

    @Schema(description = "Person in charge")
    private UnitMemberVo owner;

    @Schema(description = "Own")
    private UnitMemberVo self;

    @Schema(description = "Organization unit list of node role")
    private List<NodeRoleUnit> roleUnits;

    @Deprecated
    @Schema(description = "Node Role Member List", deprecated = true)
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<NodeRoleMemberVo> members;

    @Schema(description = "Name of the parent node that inherits permissions")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String extendNodeName;

    @Schema(description = "Whether the node belongs to the root directory")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean belongRootFolder;
}
