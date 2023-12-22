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
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

/**
 * <p>
 * Comment on specific content.
 * </p>
 */
@Data
@Schema(description = "Other reminders")
public class RemindExtraRo {

    @Deprecated
    @Schema(description = "Record Title", requiredMode = RequiredMode.REQUIRED,
        example = "First column")
    private String recordTitle;

    @Schema(description = "Comments", requiredMode = RequiredMode.REQUIRED,
        example = "@zoe&nbsp;&nbsp;Comments")
    @NotEmpty(message = "Comments")
    private String content;

    @Deprecated
    @Schema(description = "Comment time", requiredMode = RequiredMode.REQUIRED,
        example = "2020.11.26 10:30:36")
    @NotEmpty(message = "Comment time")
    private String createdAt;

}
