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

package com.apitable.space.vo;

import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * <p>
 * Email Invitation Validate View.
 * </p>
 */
@Data
@Schema(description = "Email Invitation Validate View")
public class EmailInvitationValidateVO {

    @Schema(description = "Space ID", example = "spcyQkKp9XJEl")
    private String spaceId;

    @Schema(description = "Space name", example = "Work space")
    private String spaceName;

    @Schema(description = "Invite Users", example = "Zhang San")
    private String inviter;

    @Schema(description = "Invited Email", example = "xxxx@apitable.com")
    private String inviteEmail;

    @Schema(description = "Whether it is in login status", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isLogin;

    @Schema(description = "Whether the user's email matches the invitation email", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isMatch;

    @Schema(description = "Whether the invited mailbox has an account bound", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isBound;

    @Schema(description = "Inviter's personal invitation code", example = "test")
    private String inviteCode;
}
