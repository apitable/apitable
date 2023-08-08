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

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import lombok.Data;

/**
 * <p>
 * Template Center Config Ro.
 * </p>
 */
@Data
@Schema(description = "Template Center Config Request Object")
public class TemplateCenterConfigRo {

    @Schema(description = "Request Host", example = "https://api.com")
    private String host;

    @Schema(description = "Request Bearer Token", example = "uskxx")
    private String token;

    @Schema(description = "Recommend Datasheet ID",
        requiredMode = RequiredMode.REQUIRED, example = "dstxxx")
    private String recommendDatasheetId;

    @Schema(description = "Recommend View ID", example = "viwxxx")
    private String recommendViewId;

    @Schema(description = "Template Category Datasheet ID",
        requiredMode = RequiredMode.REQUIRED, example = "dstxxx")
    private String categoryDatasheetId;

    @Schema(description = "Template Category View ID", example = "viwxxx")
    private String categoryViewId;

    @Schema(description = "Template Album Datasheet ID",
        requiredMode = RequiredMode.REQUIRED, example = "dstxxx")
    private String albumDatasheetId;

    @Schema(description = "Template Album View ID", example = "viwxxx")
    private String albumViewId;

    @Schema(description = "Template Datasheet ID",
        requiredMode = RequiredMode.REQUIRED, example = "dstxxx")
    private String templateDatasheetId;

    @Schema(description = "Template View ID", example = "viwxxx")
    private String templateViewId;
}
