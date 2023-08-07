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

package com.apitable.user.ro;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * User LabsFeature Ro.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Schema(description = "Laboratory function setting request object")
public class UserLabsFeatureRo {

    @Schema(description = "Space ID, if left blank, identify the user level function",
        type = "java.lang.String", example = "spc6e2CeZLBFN")
    private String spaceId;

    @Schema(description = "Unique identification of the laboratory function to be operated",
        type = "java.lang.String", example = "render_prompt")
    private String key;

    @Schema(description = "Whether to open", type = "java.lang.Boolean", example = "true")
    private Boolean isEnabled;
}
