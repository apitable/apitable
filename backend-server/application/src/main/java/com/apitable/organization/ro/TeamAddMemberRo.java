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

import com.apitable.core.support.deserializer.StringToLongDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import java.util.List;
import lombok.Data;

/**
 * <p>
 * Department Add Member Information Request Parameters.
 * </p>
 */
@Data
@Schema(description = "Department Add Member Information Request Parameters")
public class TeamAddMemberRo {

    @Schema(description = "Department ID, not required. If it is the root department, it can not "
        + "be transferred", type = "java.lang.String",
        requiredMode = RequiredMode.REQUIRED, example = "12032")
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long teamId;

    @Schema(description = "Department or member list", requiredMode = RequiredMode.REQUIRED)
    private List<OrgUnitRo> unitList;
}
