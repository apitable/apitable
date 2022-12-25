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

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.apitable.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * Delete node role request parameters
 * </p>
 */
@Data
@ApiModel("Delete node role request parameters")
public class DeleteNodeRoleRo {

	@ApiModelProperty(value = "The node ID is not passed to represent the root node, that is, the working directory", example = "nod10", position = 1)
	private String nodeId;

	@NotNull(message = "Organization unit cannot be empty")
	@ApiModelProperty(value = "Org Unit ID", dataType = "java.lang.String", required = true, example = "71638172638", position = 2)
	@JsonDeserialize(using = StringToLongDeserializer.class)
	private Long unitId;
}
