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

package com.apitable.workspace.ro;

import com.apitable.core.support.deserializer.StringArrayToLongArrayDeserializer;
import com.apitable.shared.validator.FieldRoleMatch;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import lombok.Data;

/**
 * <p>
 * DataSheet Field Role Creation Request Parameters.
 * </p>
 */
@Data
@Schema(description = "DataSheet Field Role Creation Request Parameters")
public class FieldRoleCreateRo {

    @NotEmpty(message = "Organization unit cannot be empty")
    @Schema(description = "Organization Unit ID Collection", type = "List",
        requiredMode = RequiredMode.REQUIRED, example = "10101,10102,10103,10104")
    @JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
    private List<Long> unitIds;

    @NotBlank(message = "Role cannot be empty")
    @FieldRoleMatch
    @Schema(description = "Role", requiredMode = RequiredMode.REQUIRED, example = "editor")
    private String role;
}
