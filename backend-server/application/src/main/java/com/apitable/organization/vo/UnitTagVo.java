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

package com.apitable.organization.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Label Unit View
 * </p>
 */
@Data
@ApiModel("Label Unit View")
public class UnitTagVo {

	@ApiModelProperty(value = "Org Unit ID", dataType = "java.lang.String", example = "1", position = 1)
	@JsonSerialize(using = ToStringSerializer.class)
	private Long unitId;

	@ApiModelProperty(value = "Member ID", dataType = "java.lang.String", example = "1", position = 2)
	@JsonSerialize(using = ToStringSerializer.class)
	private Long tagId;

	@ApiModelProperty(value = "Department name", example = "R&D Department ｜ Zhang San", position = 3)
	private String tagName;

	@ApiModelProperty(value = "Department abbreviation", example = "RESEARCH AND DEVELOPMENT", position = 4)
	private String shortName;

	@ApiModelProperty(value = "Number of members", example = "3", position = 5)
	private Integer memberCount;
}
