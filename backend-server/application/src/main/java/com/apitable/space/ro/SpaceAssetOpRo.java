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

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

/**
 * Space attachment resource request parameters
 */
@Data
@ApiModel("Space attachment resource request parameters")
public class SpaceAssetOpRo {

    @ApiModelProperty(value = "Write the token set", position = 1)
    private List<OpAssetRo> addToken = new ArrayList<>();

    @ApiModelProperty(value = "Delete token collection", position = 2)
    private List<OpAssetRo> removeToken = new ArrayList<>();

    @ApiModelProperty(value = "DataSheet Node Id", example = "dst10", position = 3, required = true)
    @NotBlank(message = "DataSheet ID cannot be empty")
    private String nodeId;

    @Getter
    @Setter
    @ApiModel("Attachment resource request parameters")
    public static class OpAssetRo {

        @ApiModelProperty(value = "Attachment token", position = 1, required = true)
        @NotNull(message = "Token cannot be empty")
        private String token;

        @ApiModelProperty(value = "Attachment name", position = 2, required = true)
        @NotNull(message = "Attachment name cannot be empty")
        private String name;
    }

}
