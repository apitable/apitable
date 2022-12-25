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

package com.apitable.asset.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;


/**
 * <p>
 * Resource Direct Transfer Token Result View
 * </p>
 */
@Data
@ApiModel("Resource Direct Transfer Token Result View")
public class AssetUploadTokenVo {

    @ApiModelProperty(value = "Upload voucher", position = 1)
    private String uploadToken;

    @ApiModelProperty(value = "Resource name", position = 2)
    private String resourceKey;

    @ApiModelProperty(value = "Upload type (QINIU: Qiniu Cloud)", position = 3)
    private String uploadType;

    @ApiModelProperty(value = "Endpoint", position = 4)
    private String endpoint;

}
