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

package com.apitable.shared.cache.bean;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Template Center - Recommend Top Banner View
 * </p>
 *
 * @author Chambers
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Banner View")
public class Banner {

    @ApiModelProperty(value = "Template ID", example = "tplumddN5Cs5p", position = 1)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String templateId;

    @ApiModelProperty(value = "Banner Image", example = "https://xxx.com/cover001.jpg", position = 2)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String image;

    @ApiModelProperty(value = "Title", example = "OKR Tracking", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String title;

    @ApiModelProperty(value = "Description", example = "It is an useful tool to keep tracking everyone's OKRs on your team.", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String desc;

    @ApiModelProperty(value = "Font Color", example = "#000000", position = 5)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String color;
}
