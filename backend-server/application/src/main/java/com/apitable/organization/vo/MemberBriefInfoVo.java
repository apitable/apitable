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
 * Basic member information view.
 * </p>
 */
@Data
@Schema(description = "Basic member information view")
public class MemberBriefInfoVo {

    @Schema(description = "Organizational Unit ID", type = "java.lang.String", example = "1")
    @JsonSerialize(using = ToStringSerializer.class)
    private Long unitId;

    @Schema(description = "Member ID", type = "java.lang.String", example = "1")
    @JsonSerialize(using = ToStringSerializer.class)
    private Long memberId;

    @Schema(description = "Member Name", example = "Zhang San")
    private String memberName;

    @Schema(description = "Whether the member has modified the nickname")
    private Boolean isMemberNameModified;

}
