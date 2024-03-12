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

package com.apitable.organization.ro;

import com.apitable.core.support.deserializer.StringToLongDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * <p>
 * New department request parameter.
 * </p>
 */
@Data
@Schema(description = "New department request parameter")
public class CreateTeamRo {

    @NotBlank
    @Size(min = 1, max = 100, message = "Department name cannot exceed 100 characters")
    @Schema(description = "Department name",
        requiredMode = RequiredMode.REQUIRED, example = "Finance Department")
    private String name;

    @NotNull
    @Schema(description = "Parent ID, 0 if the parent is root", type = "java.lang.String",
        example = "0")
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long superId;
}
