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

package com.apitable.user.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Laboratory function setting request object")
public class UserLabsFeatureRo {

    @ApiModelProperty(value = "Space ID, if left blank, identify the user level function", dataType = "java.lang.String", example = "spc6e2CeZLBFN", position = 1)
    private String spaceId;

    @ApiModelProperty(value = "Unique identification of the laboratory function to be operated", dataType = "java.lang.String", example = "render_prompt", position = 2)
    private String key;

    @ApiModelProperty(value = "Whether to open", dataType = "java.lang.Boolean", example = "true", position = 3)
    private Boolean isEnabled;
}
