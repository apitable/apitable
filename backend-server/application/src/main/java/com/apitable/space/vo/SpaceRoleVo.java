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

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.apitable.shared.support.serializer.ChinaLocalDateTimeToUtcSerializer;
import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Administrator View
 * </p>
 */
@Data
@ApiModel("Administrator View")
public class SpaceRoleVo {

    @ApiModelProperty(value = "Role ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;

    @ApiModelProperty(value = "Member ID", dataType = "java.lang.String", example = "1", position = 2)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long memberId;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "Head portrait address", example = "http://wwww.apitable.com/2019/11/12/17123187253.png", position = 3)
    private String avatar;

    @ApiModelProperty(value = "Member Name", example = "Zhang San", position = 4)
    private String memberName;

    @ApiModelProperty(value = "DEPARTMENT", example = "Technology Department/R&D Department", position = 5)
    private String team;

    @ApiModelProperty(value = "Phone number", example = "13610102020", position = 6)
    private String mobile;

    @ApiModelProperty(value = "Whether activated", example = "true", position = 7)
    private Boolean isActive;

    @JsonIgnore
    private String tempResourceGroupCodes;

    @ApiModelProperty(value = "Resource group code list", example = "[\"MANAGE_SECURITY\",\"MANAGE_TEAM\"]", position = 8)
    private List<String> resourceGroupCodes;

    @Deprecated
    @ApiModelProperty(value = "Permission range (old)", position = 9)
    private List<RoleResourceVo> resourceScope;

    @ApiModelProperty(value = "Creation time", example = "2020-03-18T15:29:59.000", position = 10)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime createTime;

    @ApiModelProperty(value = "Creation time", example = "2020-03-18T15:29:59.000", position = 11)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime createdAt;

    @ApiModelProperty(value = "Whether the user has modified the nickname", position = 12)
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "Whether the member has modified the nickname", position = 13)
    private Boolean isMemberNameModified;

    @ApiModelProperty(value = "default avatar color number", example = "1", position = 14)
    private Integer avatarColor;

    @ApiModelProperty(value = "Nick Name", example = "Zhang San", position = 15)
    private String nickName;
}
