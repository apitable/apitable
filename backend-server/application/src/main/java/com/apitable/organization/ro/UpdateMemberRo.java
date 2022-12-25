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

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.apitable.core.support.deserializer.StringArrayToLongArrayDeserializer;
import com.apitable.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * <p>
 * Edit member information request parameters
 * </p>
 */
@Data
@ApiModel("Edit member information request parameters")
public class UpdateMemberRo {

	@NotNull
	@ApiModelProperty(value = "Member ID", required = true, dataType = "java.lang.String", example = "1", position = 2)
	@JsonDeserialize(using = StringToLongDeserializer.class)
	private Long memberId;

	@ApiModelProperty(value = "Member Name", example = "Zhang San", position = 3)
    @Size(max = 32, message = "The length cannot exceed 32 bits")
	private String memberName;

	@ApiModelProperty(value = "Position", example = "Manager", position = 4)
	private String position;

	@ApiModelProperty(value = "email", example = "example@qq.com", position = 5)
	private String email;

	@Size(max = 60, message = "The job number cannot be more than 60 characters")
	@ApiModelProperty(value = "Job No", example = "\"143613308\"", position = 6)
	private String jobNumber;

	@ApiModelProperty(value = "Department ID", dataType = "List", example = "[\"10101\",\"10102\",\"10103\",\"10104\"]", position = 7)
	@JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
	private List<Long> teamIds;

	@ApiModelProperty(value = "Attribution tag ID set", dataType = "List", example = "[\"10101\",\"10102\",\"10103\",\"10104\"]", position = 8)
	@JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
	private List<Long> tagIds;
}
