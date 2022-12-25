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
import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Organization Unit View
 * </p>
 */
@Data
@ApiModel("Organization Unit View")
public class OrganizationUnitVo {

    @ApiModelProperty(value = "ID ID, classified by type, type=1, department ID, type=2, member ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;

    @ApiModelProperty(value = "Name", example = "R&D Department | Zhang San", position = 2)
    private String name;

    @ApiModelProperty(value = "Department name (not highlighted)", example = "Technical team", position = 2)
    private String originName;

    @ApiModelProperty(value = "Classification: 1-department, 2-member", example = "1", position = 3)
    private Integer type;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "Member avatar, which will be returned when classified as a member", example = "http://www.apitable.com/image.png", position = 4)
    private String avatar;

    @ApiModelProperty(value = "The department to which the member belongs will be returned when classified as a member", example = "Operation Assistant", position = 5)
    private String teams;

    @ApiModelProperty(value = "Whether the member has been activated. When classified as a member, it will return", example = "true", position = 5)
    private Boolean isActive;

    @ApiModelProperty(value = "Short name of the department. It will be returned when it is classified as a department", example = "Research and development", position = 6)
    private String shortName;

    @ApiModelProperty(value = "Number of department members, which will be returned when classified as a department", example = "3", position = 7)
    private Integer memberCount;

    @ApiModelProperty(value = "If there is a sub department, it will be returned when it is classified as a department", example = "true", position = 8)
    private Boolean hasChildren;

    @ApiModelProperty(value = "default avatar color number", example = "1", position = 9)
    private Integer avatarColor;

    @ApiModelProperty(value = "Nick Name", example = "Zhang San", position = 10)
    private String nickName;
}
