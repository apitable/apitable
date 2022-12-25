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

import java.util.List;

import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.apitable.core.support.deserializer.StringArrayToLongArrayDeserializer;

/**
 * <p>
 *     Remove role members request parameter
 * </p>
 * @author tao
 */
@Data
@ApiModel("Remove role members request")
public class DeleteRoleMemberRo {

    @NotEmpty
    @ApiModelProperty(value = "role member's unit id", required = true, position = 2)
    @JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
    private List<Long> unitIds;

}
