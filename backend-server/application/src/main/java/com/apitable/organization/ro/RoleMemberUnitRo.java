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

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.apitable.core.support.deserializer.StringToLongDeserializer;

/**
 * <p>
 *      role member unit request parameter
 * </p>
 */
@Data
@ApiModel("role member unit request parameter")
public class RoleMemberUnitRo {

    @ApiModelProperty(value = "ID", dataType = "java.lang.String", required = true, example = "120322719823", position = 1)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long id;

    @NotNull
    @ApiModelProperty(value = "unit type，1 = team，3 = member", required = true, example = "1", position = 2)
    private Integer type;
}
