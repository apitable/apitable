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

import java.util.List;

import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.NullNumberSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Widget package information (alignment with front-end structure requirements)
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Widget package information")
public class WidgetPack {

    @ApiModelProperty(value = "Widget ID", example = "wdt123", position = 1)
    private String id;

    @ApiModelProperty(value = "Widget version number", example = "0", position = 2)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long revision;

    @ApiModelProperty(value = "Package ID", example = "wpkABC", position = 3)
    private String widgetPackageId;

    @ApiModelProperty(value = "Widget package name", example = "Chart", position = 4)
    private String widgetPackageName;

    @ApiModelProperty(value = "Widget package icon", example = "https://apitable.com/space/2020/12/23/aqa", position = 5)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String widgetPackageIcon;

    @ApiModelProperty(value = "Widget package version number", example = "v1.0.0", position = 6)
    private String widgetPackageVersion;

    @ApiModelProperty(value = "Widget snapshot information", position = 7)
    private WidgetSnapshot snapshot;

    @ApiModelProperty(value = "Widget status (0: under development; 1: banned; 2: to be published; 3: published; 4: off the shelf)", position = 8)
    private Integer status;

    @ApiModelProperty(value = "Widget Author Name", position = 9)
    private String authorName;

    @ApiModelProperty(value = "Widget author Email", position = 10)
    private String authorEmail;

    @ApiModelProperty(value = "Widget Author Icon", position = 11)
    @JsonSerialize(using = ImageSerializer.class)
    private String authorIcon;

    @ApiModelProperty(value = "Widget Author Web Address", position = 12)
    private String authorLink;

    @ApiModelProperty(value = "Widget package type (0: third party, 1: official)", position = 13)
    private Integer packageType;

    @ApiModelProperty(value = "Widget publishing type (0: space station, 1: global)", position = 14)
    private Integer releaseType;

    @ApiModelProperty(value = "Widget code address", example = "https://apitable.com/code/2020/12/23/aqa", position = 15)
    @JsonSerialize(using = ImageSerializer.class)
    private String releaseCodeBundle;

    @ApiModelProperty(value = "Sandbox or not", position = 16)
    private Boolean sandbox;

    @JsonInclude(Include.NON_EMPTY)
    @ApiModelProperty(value = "Audit Applet Parent Applet Id", notes = "Dynamic key", position = 17)
    private String fatherWidgetPackageId;

    @ApiModelProperty(value = "Installation environment type", example = "dashboard", position = 18)
    private List<String> installEnv;

    @ApiModelProperty(value = "Operating environment type", example = "mobile", position = 19)
    private List<String> runtimeEnv;

}
