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
import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * <p>
 * Organization Unit View.
 * </p>
 */
@Data
@Schema(description = "Organization Unit View")
public class OrganizationUnitVo {

    @Schema(description = "ID ID, classified by type, type=1, department ID, type=2, member ID",
        type = "java.lang.String", example = "1")
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;

    @Schema(description = "Name", example = "R&D Department | Zhang San")
    private String name;

    @Schema(description = "Department name (not highlighted)", example = "Technical team")
    private String originName;

    @Schema(description = "Classification: 1-department, 2-member", example = "1")
    private Integer type;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @Schema(description = "Member avatar, which will be returned when classified as a member",
        example = "http://www.apitable.com/image.png")
    private String avatar;

    @Schema(description = "The department to which the member belongs will be returned when "
        + "classified as a member", example = "Operation Assistant")
    private String teams;

    @Schema(description = "Whether the member has been activated. When classified as a member, it"
        + " will return", example = "true")
    private Boolean isActive;

    @Schema(description = "Short name of the department. It will be returned when it is "
        + "classified as a department", example = "Research and development")
    private String shortName;

    @Schema(description = "Number of department members, which will be returned when classified "
        + "as a department", example = "3")
    private Integer memberCount;

    @Schema(description = "If there is a sub department, it will be returned when it is "
        + "classified as a department", example = "true")
    private Boolean hasChildren;

    @Schema(description = "default avatar color number", example = "1")
    private Integer avatarColor;

    @Schema(description = "Nick Name", example = "Zhang San")
    private String nickName;
}
