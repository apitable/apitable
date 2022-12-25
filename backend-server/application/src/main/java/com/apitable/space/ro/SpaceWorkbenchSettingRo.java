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

package com.apitable.space.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Space Management - Workbench Set Request Parameters
 * </p>
 *
 * The status field is consistent with the serialized object of the read library
 */
@Data
@ApiModel("Space Management - Workbench Set Request Parameters")
public class SpaceWorkbenchSettingRo {

    @ApiModelProperty(value = "All members of the node can be exported", example = "true", position = 1)
    private Boolean nodeExportable;

    @ApiModelProperty(value = "Global Watermark On Status", example = "true", position = 1)
    private Boolean watermarkEnable;
}
