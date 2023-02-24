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

package com.apitable.user.ro;

import com.apitable.shared.constants.PatternConstants;
import io.swagger.v3.oas.annotations.media.Schema;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Pattern.Flag;
import lombok.Data;

/**
 * <p>
 * Mailbox verification code verification request parameters.
 * </p>
 */
@Data
@Schema(description = "Mailbox verification code verification request parameters")
public class EmailCodeValidateRo {

    @Schema(description = "e-mail address", example = "xxxx@apitable.com", required = true)
    @NotBlank(message = "Email address cannot be empty")
    @Pattern(regexp = PatternConstants.EMAIL, message = "Incorrect mailbox format", flags =
        Flag.CASE_INSENSITIVE)
    private String email;

    @Schema(description = "Email verification code", example = "123456", required = true)
    @NotBlank(message = "The verification code cannot be empty")
    private String code;
}
