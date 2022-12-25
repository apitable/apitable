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

package com.apitable.template.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Template Center Config Ro
 * </p>
 */
@Data
@ApiModel("Template Center Config Request Object")
public class TemplateCenterConfigRo {

    @ApiModelProperty(value = "Request Host", example = "https://api.com", position = 1)
    private String host;

    @ApiModelProperty(value = "Request Bearer Token", example = "uskxx", position = 2)
    private String token;

    @ApiModelProperty(value = "Recommend Datasheet ID", example = "dstxxx", position = 3, required = true)
    private String recommendDatasheetId;

    @ApiModelProperty(value = "Recommend View ID", example = "viwxxx", position = 3)
    private String recommendViewId;

    @ApiModelProperty(value = "Template Category Datasheet ID", example = "dstxxx", position = 4, required = true)
    private String categoryDatasheetId;

    @ApiModelProperty(value = "Template Category View ID", example = "viwxxx", position = 4)
    private String categoryViewId;

    @ApiModelProperty(value = "Template Album Datasheet ID", example = "dstxxx", position = 5, required = true)
    private String albumDatasheetId;

    @ApiModelProperty(value = "Template Album View ID", example = "viwxxx", position = 5)
    private String albumViewId;

    @ApiModelProperty(value = "Template Datasheet ID", example = "dstxxx", position = 6, required = true)
    private String templateDatasheetId;

    @ApiModelProperty(value = "Template View ID", example = "viwxxx", position = 6)
    private String templateViewId;
}
