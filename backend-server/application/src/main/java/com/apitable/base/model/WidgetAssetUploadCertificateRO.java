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

import java.util.List;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * widget file upload certificate ro
 * </p>
 *
 * @author tao
 */
@Data
@ApiModel("widget file upload certificate ro")
public class WidgetAssetUploadCertificateRO {

    @ApiModelProperty(value = "the file names， max: 20. when fileType asset, it need", position = 1)
    private List<String> filenames;

    @ApiModelProperty(value = "file type：0：asset; 1：package; 2: public", position = 2)
    @NotNull
    private Integer fileType;

    @ApiModelProperty(value = "the amount of token, max: 20. when fileType no asset, it need", position = 3)
    private Integer count;

    @ApiModelProperty(value = "the package's version. when fileType package, it need", position = 4)
    private String version;

    @ApiModelProperty(value = "the file extend name. when fileType package, it optional, such as: .js", position = 5)
    private List<String> fileExtName;

}
