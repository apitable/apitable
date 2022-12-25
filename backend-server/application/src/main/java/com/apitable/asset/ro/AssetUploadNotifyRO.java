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

package com.apitable.asset.ro;

import java.util.List;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * Resource upload completion notification RO
 */
@Data
@ApiModel("Resource upload completion notification RO")
public class AssetUploadNotifyRO {

    @ApiModelProperty(value = "Type (0: user avatar; 1: space logo; 2: number table attachment; 3: cover image; 4: node description)", example = "0", position = 1, required = true)
    @NotNull(message = "Type cannot be null")
    private Integer type;

    @ApiModelProperty(value = "List of resource names", example = "[\"spc10/2019/12/10/159\", \"spc10/2019/12/10/168\"]", position = 2)
    private List<String> resourceKeys;

}
