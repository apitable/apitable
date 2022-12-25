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

package com.apitable.internal.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullNumberSerializer;

/**
 * attachment capacity information view for spaces
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Attachment capacity information view for spaces")
public class InternalSpaceCapacityVo {

    @ApiModelProperty(value = "whether to allow over limiting", example = "false", position = 1)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isAllowOverLimit;

    @ApiModelProperty(value = "used capacity unit byte", dataType = "java.lang.String", example = "1024", position = 1)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long usedCapacity;

    @ApiModelProperty(value = "total capacity unit byte", dataType = "java.lang.String", example = "1024", position = 2)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long totalCapacity;

    @ApiModelProperty(value = "current package capacity unit byte", dataType = "java.lang.String", example = "1024", position = 3)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long currentBundleCapacity;

    @ApiModelProperty(value = "gift unexpired capacity unit byte", dataType = "java.lang.String", example = "1024", position = 4)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long unExpireGiftCapacity;
}
