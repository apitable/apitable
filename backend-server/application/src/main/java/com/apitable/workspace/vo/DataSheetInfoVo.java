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

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.apitable.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Result view of data table information
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
@ApiModel("Result view of data table information")
public class DataSheetInfoVo {

    @ApiModelProperty(value = "Node Description", position = 1)
    private String description;

    @ApiModelProperty(value = "Whether the node is shared", position = 1)
    private Boolean nodeShared;

    @ApiModelProperty(value = "Whether the node permission is set", position = 2)
    private Boolean nodePermitSet;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "Digital meter icon", example = "smile", position = 2)
    private String icon;

    @ApiModelProperty(value = "Number table name", example = "E-commerce project workbench", position = 2)
    private String name;

    @ApiModelProperty(value = "Number table custom ID", position = 3)
    private String id;

    @ApiModelProperty(value = "Parent Node Id", example = "nod10", position = 4)
    private String parentId;

    @ApiModelProperty(value = "Version No", example = "0", position = 4)
    private Long revision;

    @ApiModelProperty(value = "Owner", position = 7)
    private Long ownerId;

    @ApiModelProperty(value = "Creator", position = 8)
    private Long creatorId;

    @ApiModelProperty(value = "Space id", position = 9)
    private String spaceId;

    @ApiModelProperty(value = "Role", example = "editor", position = 13)
    private String role;

    @ApiModelProperty(value = "Node Permissions", position = 14)
    private NodePermissionView permissions;
}
