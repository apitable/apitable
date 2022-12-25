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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Attachment resource upload voucher result VO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Attachment resource upload voucher result VO")
public class AssetUploadCertificateVO {

    @ApiModelProperty(value = "File Access Path(possibly non-final value)", example = "spc10/2019/12/10/159.jpg", position = 1)
    private String token;

    @ApiModelProperty(value = "Upload request URL", example = "https://bucket.s3.us-east-1.amazon.com/resourceKey?X-Amz-Algorithm=AWS4-HMAC-SHA256", position = 3)
    private String uploadUrl;

    @ApiModelProperty(value = "Upload request method", example = "POST", position = 4)
    private String uploadRequestMethod;
}
