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

/**
 * <p>
 * Applet Package Information View
 * </p>
 */
@Data
@ApiModel("Applet Package Information View")
public class WidgetPackageInfoVo {

    @ApiModelProperty(value = "Package ID", example = "wpkABC", position = 1)
    private String packageId;

    @ApiModelProperty(value = "Widget name - returned according to the request Accept Language. Default:zh-CN，Current Support List：「en-US/zh-CN」", example = "Chart", position = 2)
    private String name;

    @ApiModelProperty(value = "Widget package icon", example = "https://apitable.com/space/2020/12/23/aqa", position = 3)
    @JsonSerialize(using = ImageSerializer.class)
    private String icon;

    @ApiModelProperty(value = "Cover drawing of component package", example = "https://apitable.com/space/2020/12/23/aqa", position = 4)
    @JsonSerialize(using = ImageSerializer.class)
    private String cover;

    @ApiModelProperty(value = "Widget description - returned according to the request Accept Language, default: zh CN, current support list:「en-US/zh-CN」", example = "This is the description of a chart applet", position = 5)
    private String description;

    @ApiModelProperty(value = "Widget package version number", example = "1.0.0", position = 6)
    private String version;

    @ApiModelProperty(value = "Widget package status (0: under development; 1: banned; 2: to be published; 3: published; 4: off the shelf)", example = "3", position = 7)
    private Integer status;

    @ApiModelProperty(value = "Author Name", position = 8)
    private String authorName;

    @ApiModelProperty(value = "Author icon", position = 9)
    @JsonSerialize(using = ImageSerializer.class)
    private String authorIcon;

    @ApiModelProperty(value = "Author Email", position = 10)
    private String authorEmail;

    @ApiModelProperty(value = "Author website address", position = 11)
    private String authorLink;

    @ApiModelProperty(value = "Widget package type (0: third party, 1: official)", position = 12)
    private Integer packageType;

    @ApiModelProperty(value = "0: Publish to the component store in the space station, 1: Publish to the global app store", position = 13)
    private Integer releaseType;

}
