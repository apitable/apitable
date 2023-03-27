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

import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Result view of data table information.
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
@Schema(description = "Result view of data table information")
public class DataSheetInfoVo {

    @Schema(description = "Node Description")
    private String description;

    @Schema(description = "Whether the node is shared")
    private Boolean nodeShared;

    @Schema(description = "Whether the node permission is set")
    private Boolean nodePermitSet;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @Schema(description = "Digital meter icon", example = "smile")
    private String icon;

    @Schema(description = "Number table name", example = "E-commerce project workbench")
    private String name;

    @Schema(description = "Number table custom ID")
    private String id;

    @Schema(description = "Parent Node Id", example = "nod10")
    private String parentId;

    @Schema(description = "Version No", example = "0")
    private Long revision;

    @Schema(description = "Owner")
    private Long ownerId;

    @Schema(description = "Creator")
    private Long creatorId;

    @Schema(description = "Space id")
    private String spaceId;

    @Schema(description = "Role", example = "editor")
    private String role;

    @Schema(description = "Node Permissions")
    private NodePermissionView permissions;
}
