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

package com.apitable.space.ro;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

/**
 * Space attachment resource request parameters.
 */
@Data
@Schema(description = "Space attachment resource request parameters")
public class SpaceAssetOpRo {

    @Schema(description = "Write the token set")
    private List<OpAssetRo> addToken = new ArrayList<>();

    @Schema(description = "Delete token collection")
    private List<OpAssetRo> removeToken = new ArrayList<>();

    @Schema(description = "DataSheet Node Id",
        requiredMode = RequiredMode.REQUIRED, example = "dst10")
    @NotBlank(message = "DataSheet ID cannot be empty")
    private String nodeId;

    /**
     * OpAssetRo.
     */
    @Getter
    @Setter
    @Schema(description = "Attachment resource request parameters")
    public static class OpAssetRo {

        @Schema(description = "Attachment token", requiredMode = RequiredMode.REQUIRED)
        @NotNull(message = "Token cannot be empty")
        private String token;

        @Schema(description = "Attachment name", requiredMode = RequiredMode.REQUIRED)
        @NotNull(message = "Attachment name cannot be empty")
        private String name;
    }

}
