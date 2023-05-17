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

import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.MobilePhoneHideSerializer;
import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

/**
 * <p>
 * Member Company View.
 * </p>
 */
@Data
@Schema(description = "Member Company View")
public class UnitMemberVo {

    @Schema(description = "Org Unit ID", type = "java.lang.String", example = "1")
    @JsonSerialize(using = ToStringSerializer.class)
    private Long unitId;

    @Schema(description = "Member ID", type = "java.lang.String", example = "1")
    @JsonSerialize(using = ToStringSerializer.class)
    private Long memberId;

    @Schema(description = "User ID (the actual return is uuid)", type = "java.lang.String",
        example = "1")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String userId;

    @Schema(description = "User UUID", type = "java.lang.String", example = "1")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String uuid;

    @Schema(description = "Member name (not highlighted)", example = "Zhang San")
    private String originName;

    @Schema(description = "Member Name", example = "R&D Department｜Zhang San")
    private String memberName;

    @Schema(description = "Member Email Address", example = "123456@apitable.com")
    private String email;

    @Schema(description = "Member mobile number", example = "136****9061")
    @JsonSerialize(nullsUsing = NullStringSerializer.class,
        using = MobilePhoneHideSerializer.class)
    private String mobile;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @Schema(description = "Member avatar", example = "http://www.apitable.com/image.png")
    private String avatar;

    @Schema(description = "Whether activated", example = "true")
    private Boolean isActive;

    @Schema(description = "Member's Department", example = "Operation Department｜Product "
        + "Department｜R&D Department")
    private String teams;

    @Schema(description = "Administrator or not", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isAdmin;

    @Schema(description = "Whether the user has modified the nickname")
    private Boolean isNickNameModified;

    @Schema(description = "Whether the member has modified the nickname")
    private Boolean isMemberNameModified;

    @Schema(description = "team id and full hierarchy team path name")
    private List<MemberTeamPathInfo> teamData;

    @Schema(description = "default avatar color number", example = "1")
    private Integer avatarColor;

    @Schema(description = "Nick Name", example = "Zhang San")
    private String nickName;

    public String getOriginName() {
        return originName != null ? originName : memberName;
    }
}
