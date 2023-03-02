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
import com.apitable.shared.constants.PatternConstants;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.v3.oas.annotations.media.Schema;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Pattern.Flag;
import lombok.Data;

/**
 * <p>
 * Invite Member Parameters.
 * </p>
 */
@Data
@Schema(description = "Invite Member Parameters")
public class InviteMemberRo {

    @Schema(description = "Email address, strictly checked", example = "123456@qq.com", required
        = true)
    @Pattern(regexp = PatternConstants.EMAIL, message = "Incorrect mailbox format", flags =
        Flag.CASE_INSENSITIVE)
    private String email;

    @Schema(description = "Assign department ID, optional. If it is not transferred, it will be "
        + "added under the root door of the space by default", type = "java.lang.String",
        example = "16272126")
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long teamId;
}
