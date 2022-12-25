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

package com.apitable.organization.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * <p>
 * Template resolution result view
 * </p>
 */
@Data
@ApiModel("Template resolution result view、")
public class UploadParseResultVO {

    @ApiModelProperty(value = "Total number of resolutions", example = "100", position = 1)
    private Integer rowCount;

    @ApiModelProperty(value = "Number of successful parsing", example = "198", position = 2)
    private Integer successCount;

    @ApiModelProperty(value = "Number of failed parsing", example = "2", position = 3)
    private Integer errorCount;

    private List<ParseErrorRecordVO> errorList;
}
