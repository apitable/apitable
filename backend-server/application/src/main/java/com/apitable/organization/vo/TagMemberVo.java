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

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * <p>
 * Member list view of the tag.
 * </p>
 */
@Data
@Schema(description = "Member list view of the tag")
public class TagMemberVo {

    @Schema(description = "Member ID", example = "1")
    @JsonSerialize(using = ToStringSerializer.class)
    private Long memberId;

    @Schema(description = "Member Name", example = "Zhang San")
    private String memberName;

    @Schema(description = "Job No", example = "000101")
    private String jobNumber;

    @Schema(description = "Phone number", example = "13610102020")
    private String mobile;

    @Schema(description = "Email", example = "example@qq.com")
    private String email;

    @Schema(description = "Department", example = "Design Department, Test Department and "
        + "Development Department")
    private String depts;
}
