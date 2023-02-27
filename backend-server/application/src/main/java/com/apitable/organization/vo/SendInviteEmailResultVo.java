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

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * <p>
 * Send Invitation Message Result View.
 * </p>
 */
@Data
@Schema(description = "Send Invitation Message Result View")
public class SendInviteEmailResultVo {

    @Schema(description = "Total sent", example = "1")
    private int total;

    @Schema(description = "Number of successful sending", example = "1")
    private int success;

    @Schema(description = "Number of sending failures", example = "1")
    private int error;

    @Schema(description = "Whether the mailbox has been bound", example = "true")
    private Boolean isBound;
}
