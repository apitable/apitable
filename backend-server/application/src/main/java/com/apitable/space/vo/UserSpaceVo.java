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

import com.apitable.shared.support.serializer.NullArraySerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Collection;
import lombok.Data;

/**
 * <p>
 * User's resource information in the specified space.
 * </p>
 */
@Data
@Schema(description = "User's resource information view in the space")
public class UserSpaceVo {

    @Schema(description = "Space name", example = "My Workspace")
    private String spaceName;

    @Schema(description = "Primary administrator or not", example = "true")
    private Boolean mainAdmin;

    @Schema(description = "Permission", type = "List",
        example = "[\"MANAGE_TEAM\",\"MANAGE_MAIN_ADMIN\"]")
    @JsonSerialize(using = NullArraySerializer.class, nullsUsing = NullArraySerializer.class)
    private Collection<String> permissions;
}
