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

import com.apitable.shared.support.serializer.NullNumberSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;

/**
 * Space View
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Space List View")
public class SpaceVO {

    @ApiModelProperty(value = "Space ID", example = "spc10", position = 1)
    private String spaceId;

    @ApiModelProperty(value = "Name", example = "This is a space", position = 2)
    private String name;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "Icon", example = "https://...", position = 3)
    private String logo;

    @ApiModelProperty(value = "Whether there are red dots", example = "false", position = 4)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean point;

    @ApiModelProperty(value = "Whether it is the main administrator of the space", example = "false", position = 5)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean admin;

    @ApiModelProperty(value = "Whether it is in pre deletion status", example = "false", position = 7)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean preDeleted;

    @ApiModelProperty(value = "Maximum total number of subscription plan members", position = 8)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxSeat;

    @ApiModelProperty(value = "Space domain name", position = 9)
    private String spaceDomain;

    @ApiModelProperty(value = "Third party integration binding information", position = 10)
    private SpaceSocialConfig social;
}
