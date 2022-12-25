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

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("Token request parameters for direct resource transfer")
public class AssetUploadTokenRo {

    @Deprecated
    @ApiModelProperty(value = "upload prefix scope（0:single-default；1: multi）", position = 1)
    private Integer prefixalScope;

    @ApiModelProperty(value = "required when uploading a single file", position = 2)
    private String assetsKey;

    @ApiModelProperty(value = "space id", position = 3)
    private String spaceId;

}
