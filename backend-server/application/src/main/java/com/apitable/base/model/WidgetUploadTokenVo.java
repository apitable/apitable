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

package com.apitable.base.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;

/**
 * widget upload token
 * @author tao
 */
@Data
@ApiModel("widget upload toke require")
@Builder
public class WidgetUploadTokenVo {


    @ApiModelProperty(value = "resource key", example = "widget/wpkXxx/icon.png")
    private String token;

    @ApiModelProperty(value = "upload url", example = "https://bucket.s3.us-east-1.amazon.com/resourceKey?X-Amz-Algorithm=AWS4-HMAC-SHA256", position = 2)
    private String uploadUrl;

    @ApiModelProperty(value = "upload request method", example = "POST", position = 3)
    private String uploadRequestMethod;

}