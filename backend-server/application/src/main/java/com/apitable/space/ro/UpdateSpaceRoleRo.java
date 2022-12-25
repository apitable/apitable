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

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.apitable.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * <p>
 * Update administrator request parameters
 * </p>
 */
@ApiModel("Update administrator request parameters")
@Data
public class UpdateSpaceRoleRo {

	@NotNull(message = "ID cannot be empty")
	@ApiModelProperty(value = "Role ID", dataType = "java.lang.String", example = "1", required = true, position = 2)
	@JsonDeserialize(using = StringToLongDeserializer.class)
	private Long id;

	@NotNull(message = "The selected member cannot be empty")
	@ApiModelProperty(value = "Select Member ID", dataType = "java.lang.String", example = "1", required = true, position = 2)
	@JsonDeserialize(using = StringToLongDeserializer.class)
	private Long memberId;

	@NotEmpty(message = "The assignment permission cannot be empty")
	@ApiModelProperty(value = "Operation resource set, no sorting, automatic verification", dataType = "List", required = true, example = "[\"MANAGE_TEAM\",\"MANAGE_MEMBER\"]", position = 2)
	private List<String> resourceCodes;
}
