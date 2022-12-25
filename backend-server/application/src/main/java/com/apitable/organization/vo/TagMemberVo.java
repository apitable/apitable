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
 * Member list view of the tag
 * </p>
 */
@Data
@ApiModel("Member list view of the tag")
public class TagMemberVo {

    @ApiModelProperty(value = "Member ID", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long memberId;

    @ApiModelProperty(value = "Member Name", example = "Zhang San", position = 2)
    private String memberName;

    @ApiModelProperty(value = "Job No", example = "000101", position = 3)
    private String jobNumber;

    @ApiModelProperty(value = "Phone number", example = "13610102020", position = 4)
    private String mobile;

    @ApiModelProperty(value = "Email", example = "example@qq.com", position = 5)
    private String email;

    @ApiModelProperty(value = "Department", example = "Design Department, Test Department and Development Department", position = 6)
    private String depts;
}
