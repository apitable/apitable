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

package com.apitable.workspace.vo;

import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * <p>
 * Node Member View.
 * </p>
 */
@Data
@Schema(description = "Field Member View")
public class FieldRoleMemberVo {

    @Schema(description = "Member ID", type = "java.lang.String", example = "1")
    @JsonSerialize(using = ToStringSerializer.class)
    private Long memberId;

    @Schema(description = "Member Name", example = "R&D Department ｜ Zhang San")
    private String memberName;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @Schema(description = "Member avatar", example = "https://apitable.com/image.png")
    private String avatar;

    @Schema(description = "Member's Department", example = "Operation Department | Product "
        + "Department | R&D Department")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String teams;

    @Schema(description = "Role", example = "manager")
    private String role;

    @Schema(description = "When an organization unit is a member, indicate whether it is an "
        + "administrator", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isAdmin;
}
