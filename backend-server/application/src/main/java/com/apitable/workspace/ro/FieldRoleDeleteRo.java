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

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.apitable.core.support.deserializer.StringToLongDeserializer;

/**
 * <p>
 * DataSheet field role deletion request parameter
 * </p>
 */
@Data
@ApiModel("DataSheet field role deletion request parameter")
public class FieldRoleDeleteRo {

    @NotNull(message = "Organization unit cannot be empty")
    @ApiModelProperty(value = "Org Unit ID", dataType = "java.lang.String", required = true, example = "761263712638", position = 2)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long unitId;
}
