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
import com.apitable.shared.support.serializer.NullNumberSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Widget package information (alignment with front-end structure requirements).
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Schema(description = "Widget package information")
public class WidgetPack {

    @Schema(description = "Widget ID", example = "wdt123")
    private String id;

    @Schema(description = "Widget version number", example = "0")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long revision;

    @Schema(description = "Package ID", example = "wpkABC")
    private String widgetPackageId;

    @Schema(description = "Widget package name", example = "Chart")
    private String widgetPackageName;

    @Schema(description = "Widget package icon",
        example = "https://apitable.com/space/2020/12/23/aqa")
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String widgetPackageIcon;

    @Schema(description = "Widget package version number", example = "v1.0.0")
    private String widgetPackageVersion;

    @Schema(description = "Widget snapshot information")
    private WidgetSnapshot snapshot;

    @Schema(description = "Widget status (0: under development; 1: banned; 2: to be published; 3:"
        + " published; 4: off the shelf)")
    private Integer status;

    @Schema(description = "Widget Author Name")
    private String authorName;

    @Schema(description = "Widget author Email")
    private String authorEmail;

    @Schema(description = "Widget Author Icon")
    @JsonSerialize(using = ImageSerializer.class)
    private String authorIcon;

    @Schema(description = "Widget Author Web Address")
    private String authorLink;

    @Schema(description = "Widget package type (0: third party, 1: official)")
    private Integer packageType;

    @Schema(description = "Widget publishing type (0: space station, 1: global)")
    private Integer releaseType;

    @Schema(description = "Widget code address",
        example = "https://apitable.com/code/2020/12/23/aqa")
    @JsonSerialize(using = ImageSerializer.class)
    private String releaseCodeBundle;

    @Schema(description = "Sandbox or not")
    private Boolean sandbox;

    @JsonInclude(Include.NON_EMPTY)
    @Schema(description = "Audit Applet Parent Applet Id")
    private String fatherWidgetPackageId;

    @Schema(description = "Installation environment type", example = "dashboard")
    private List<String> installEnv;

    @Schema(description = "Operating environment type", example = "mobile")
    private List<String> runtimeEnv;

}
