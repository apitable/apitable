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

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * <p>
 * Remove tag member request parameters
 * </p>
 */
@Data
@ApiModel("Remove tag member request parameters")
public class DeleteTagMemberRo {

    @NotNull
    @ApiModelProperty(value = "Member ID", example = "1", required = true, position = 2)
    private Long tagId;

    @NotEmpty
    @Size(max = 100)
    @ApiModelProperty(value = "Member ID Collection", dataType = "List", example = "[1,2,3,4]", required = true, position = 3)
    private List<Long> memberId;
}
