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

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Data;

/**
 * <p>
 * Remove tag member request parameters.
 * </p>
 */
@Data
@Schema(description = "Remove tag member request parameters")
public class DeleteTagMemberRo {

    @NotNull
    @Schema(description = "Member ID", example = "1", requiredMode = RequiredMode.REQUIRED)
    private Long tagId;

    @NotEmpty
    @Size(max = 100)
    @Schema(description = "Member ID Collection", type = "List", example = "[1,2,3,4]",
        requiredMode = RequiredMode.REQUIRED)
    private List<Long> memberId;
}
