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

package com.apitable.widget.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Template Widget Package Information View
 * </p>
 */
@Data
@ApiModel("Template Widget Package Information View")
public class WidgetTemplatePackageInfo {

    @ApiModelProperty(value = "Widget Package ID", example = "wpkABC", position = 1)
    private String widgetPackageId;

    @ApiModelProperty(value = "Widget package name", example = "Chart", position = 2)
    private String name;

    @ApiModelProperty(value = "Widget package icon", example = "https://apitable.com/space/2020/12/23/aqa", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String icon;

    @ApiModelProperty(value = "Widget Package Cover", example = "https://apitable.com/space/2020/12/23/aqa", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String cover;

    @ApiModelProperty(value = "Describe", example = "This is the description of a chart applet", position = 5)
    private String description;

    @ApiModelProperty(value = "Widget package version number", example = "1.0.0", position = 6)
    private String version;

    @ApiModelProperty(value = "Code Address", example = "https://apitable.com/code/2020/12/23/aqa", position = 7)
    @JsonSerialize(using = ImageSerializer.class)
    private String releaseCodeBundle;

    @ApiModelProperty(value = "Source code address", example = "https://apitable.com/code/2020/12/23/aqa", position = 8)
    @JsonSerialize(using = ImageSerializer.class)
    private String sourceCodeBundle;

    @ApiModelProperty(value = "Widget Package Extension Information", position = 9)
    private WidgetTemplatePackageExtraInfo extras;

}
