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

package com.apitable.space.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Internal test function status value object.
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Schema(description = "Internal test function status")
public class FeatureVo {

    @Schema(description = "Unique identification of laboratory function",
        type = "java.lang.String", example = "robot")
    private String key;

    @Schema(description = "Laboratory function category",
        type = "java.lang.String", example = "review")
    private String type;

    @Schema(description = "Laboratory function application internal test form url",
        type = "java.lang.String")
    private String url;

    @Schema(description = "Laboratory function opening status",
        type = "java.lang.Boolean", example = "true")
    private Boolean open;
}
