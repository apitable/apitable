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

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.validation.annotation.Validated;

/**
 * <p>
 * Get members who have no permission on the specified node when mentioning people.
 * </p>
 */
@Schema(description = "Get members who have no permission on the specified node when mentioning "
    + "people")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
@Validated
public class RemindUnitsNoPermissionRo {

    @Schema(description = "Node ID", requiredMode = RequiredMode.REQUIRED)
    @NotBlank
    private String nodeId;

    @Schema(description = "Organizational Unit ID List", requiredMode = RequiredMode.REQUIRED)
    @NotEmpty
    private List<Long> unitIds;

}
