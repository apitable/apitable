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

import javax.validation.constraints.NotEmpty;
import java.util.List;

/**
 * <p>
 * Delete Member Request Parameter
 * </p>
 */
@Data
@ApiModel("Batch Delete Member Request Parameters")
public class DeleteBatchMemberRo {

    @ApiModelProperty(value = "Delete action (0: delete this department, 1: delete from the organization structure completely)", example = "0", position = 1)
    private int action;

    @NotEmpty
    @ApiModelProperty(value = "Member ID Collection", dataType = "List", example = "[\"10101\",\"10102\",\"10103\",\"10104\"]", required = true, position = 2)
    @JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
    private List<Long> memberId;

    @ApiModelProperty(value = "Department ID, if it is the root department, can not be transferred. It is deleted from the root door by default, consistent with the principle of removing members from the space", dataType = "java.lang.String", example = "1", required = true, position = 3)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long teamId;
}
