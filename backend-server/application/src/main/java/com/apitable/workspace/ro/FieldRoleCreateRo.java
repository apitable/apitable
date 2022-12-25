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

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.apitable.shared.validator.FieldRoleMatch;
import com.apitable.core.support.deserializer.StringArrayToLongArrayDeserializer;

/**
 * <p>
 * DataSheet Field Role Creation Request Parameters
 * </p>
 */
@Data
@ApiModel("DataSheet Field Role Creation Request Parameters")
public class FieldRoleCreateRo {

    @NotEmpty(message = "Organization unit cannot be empty")
    @ApiModelProperty(value = "Organization Unit ID Collection", dataType = "List", example = "10101,10102,10103,10104", required = true, position = 2)
    @JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
    private List<Long> unitIds;

    @NotBlank(message = "Role cannot be empty")
    @FieldRoleMatch
    @ApiModelProperty(value = "Role", example = "editor", required = true, position = 3)
    private String role;
}
