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
import com.apitable.shared.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * Favorite node information
 * </p>
 */
@Data
@ApiModel("Favorite node information")
@EqualsAndHashCode(callSuper = true)
public class FavoriteNodeInfo extends NodeInfoVo {

    @ApiModelProperty(value = "The predecessor node ID of the favorite node", example = "nod11", position = 15)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String preFavoriteNodeId;
}
