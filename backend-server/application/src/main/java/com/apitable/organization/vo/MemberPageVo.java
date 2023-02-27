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

import com.apitable.shared.support.serializer.ChinaLocalDateTimeToUtcSerializer;
import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

/**
 * <p>
 * Page: member list view.
 * </p>
 */
@Data
@Schema(description = "Page: member list view")
public class MemberPageVo {

    @Schema(description = "Member ID", type = "java.lang.String", example = "1")
    @JsonSerialize(using = ToStringSerializer.class)
    private Long memberId;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @Schema(description = "Head portrait address", example = "http://wwww.apitable"
        + ".com/2019/11/12/17123187253.png")
    private String avatar;

    @Schema(description = "User nickname", example = "This is a user nickname")
    private String nickName;

    @Schema(description = "Member Name", example = "Zhang San")
    private String memberName;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @Schema(description = "Phone number", example = "13344445555")
    private String mobile;

    @Schema(description = "Email", example = "example@qq.com")
    private String email;

    @Schema(description = "Department ID", example = "1,2,3")
    private String teamIds;

    @Schema(description = "Department", example = "R&D Department | Operation Department | Design"
        + " Department")
    private String teams;

    @Schema(description = "Whether activated", example = "true")
    private Boolean isActive;

    @Schema(description = "Primary administrator or not", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isPrimary;

    @Schema(description = "Sub administrator or not", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isSubAdmin;

    @Schema(description = "Creat time", example = "2020-03-18T15:29:59.000")
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime createdAt;

    @Schema(description = "Update time", example = "2020-03-18T15:29:59.000")
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime updatedAt;

    @Schema(description = "Whether the user has modified the nickname")
    private Boolean isNickNameModified;

    @Schema(description = "Whether the member has modified the nickname")
    private Boolean isMemberNameModified;

    @Schema(description = "team' id and full hierarchy team path name")
    private List<MemberTeamPathInfo> teamData;

    @Schema(description = "default avatar color number", example = "1")
    private Integer avatarColor;
}
