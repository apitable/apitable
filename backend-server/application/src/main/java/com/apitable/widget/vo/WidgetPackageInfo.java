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

import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * <p>
 * Widget package information view.
 * </p>
 */
@Data
@Schema(description = "Widget package information view")
public class WidgetPackageInfo {

    @Schema(description = "Package ID", example = "wpkABC")
    private String widgetPackageId;

    @Schema(description = "Widget package name", example = "CHART")
    private String name;

    @Deprecated
    @Schema(description = "English name", example = "chart")
    private String nameEn;

    @Schema(description = "Widget package icon",
        example = "https://apitable.com/space/2020/12/23/aqa")
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String icon;

    @Schema(description = "Cover drawing of component package",
        example = "https://apitable.com/space/2020/12/23/aqa")
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String cover;

    @Schema(description = "DESCRIBE", example = "This is the description of a chart applet")
    private String description;

    @Schema(description = "Widget package version number", example = "1.0.0")
    private String version;

    @Schema(description = "Author Name")
    private String authorName;

    @Schema(description = "Author icon")
    @JsonSerialize(using = ImageSerializer.class)
    private String authorIcon;

    @Schema(description = "Author Email")
    private String authorEmail;

    @Schema(description = "Author website address")
    private String authorLink;

    @Schema(description = "Widget package type (0: third party, 1: official)")
    private Integer packageType;

    @Schema(description = "0: Publish to the component store in the space station, 1: Publish to "
        + "the global app store")
    private Integer releaseType;

    @Schema(description = "Widget package status (0: to be approved; 1: not passed; 2: to be "
        + "released; 3: online; 4: offline)", example = "3")
    private Integer status;

}
