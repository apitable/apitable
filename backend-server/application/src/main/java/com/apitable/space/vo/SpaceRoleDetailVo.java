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

package com.apitable.space.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * <p>
 * Administrator permission information view
 * </p>
 */
@Data
@ApiModel("Administrator permission information view")
public class SpaceRoleDetailVo {

	@ApiModelProperty(value = "Administrator Name", example = "Zhang San", position = 1)
	private String memberName;

	@ApiModelProperty(value = "The permission code set owned by the administrator", dataType = "List", example = "[\"MANAGE_MEMBER\",\"MANAGE_TEAM\"]", position = 2)
	private List<String> resources;
}
