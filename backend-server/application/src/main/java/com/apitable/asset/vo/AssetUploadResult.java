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

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Resource upload result view
 * </p>
 */
@Data
@ApiModel("Resource upload result view")
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class AssetUploadResult {

    @ApiModelProperty(value = "File Access Path", example = "spc10/2019/12/10/159.jpg", position = 1)
    private String token;

    @ApiModelProperty(value = "Preview Path", example = "spc10/2019/12/10/159.jpg", position = 2)
    private String preview;

    @ApiModelProperty(value = "MIME Type", example = "image/pdf", position = 3)
    private String mimeType;

    @ApiModelProperty(value = "File size", example = "1204", position = 4)
    private Long size;

    @ApiModelProperty(value = "Cloud storage type", example = "QNY", position = 5)
    private String bucket;

    @ApiModelProperty(value = "Document name", example = "image.jpg", position = 5)
    private String name;

    @ApiModelProperty(value = "Picture height", example = "100", position = 6)
    @JsonInclude(value = JsonInclude.Include.NON_NULL)
    private Integer height;

    @ApiModelProperty(value = "Image width", example = "80", position = 5)
    @JsonInclude(value = JsonInclude.Include.NON_NULL)
    private Integer width;

    public AssetUploadResult(String token) {
        this.token = token;
    }
}
