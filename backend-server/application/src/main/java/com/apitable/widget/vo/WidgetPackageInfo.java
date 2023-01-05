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
 * Widget package information view
 * </p>
 */
@Data
@ApiModel("Widget package information view")
public class WidgetPackageInfo {

    @ApiModelProperty(value = "Package ID", example = "wpkABC", position = 1)
    private String widgetPackageId;

    @ApiModelProperty(value = "Widget package name", example = "CHART", position = 2)
    private String name;

    @Deprecated
    @ApiModelProperty(value = "English name", example = "chart", position = 2)
    private String nameEn;

    @ApiModelProperty(value = "Widget package icon", example = "https://apitable.com/space/2020/12/23/aqa", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String icon;

    @ApiModelProperty(value = "Cover drawing of component package", example = "https://apitable.com/space/2020/12/23/aqa", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String cover;

    @ApiModelProperty(value = "DESCRIBE", example = "This is the description of a chart applet", position = 4)
    private String description;

    @ApiModelProperty(value = "Widget package version number", example = "1.0.0", position = 5)
    private String version;

    @ApiModelProperty(value = "Author Name", position = 6)
    private String authorName;

    @ApiModelProperty(value = "Author icon", position = 7)
    @JsonSerialize(using = ImageSerializer.class)
    private String authorIcon;

    @ApiModelProperty(value = "Author Email", position = 8)
    private String authorEmail;

    @ApiModelProperty(value = "Author website address", position = 9)
    private String authorLink;

    @ApiModelProperty(value = "Widget package type (0: third party, 1: official)", position = 10)
    private Integer packageType;

    @ApiModelProperty(value = "0: Publish to the component store in the space station, 1: Publish to the global app store", position = 11)
    private Integer releaseType;

    @ApiModelProperty(value = "Widget package status (0: to be approved; 1: not passed; 2: to be released; 3: online; 4: offline)", example = "3", position = 12)
    private Integer status;

}
