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

package com.apitable.template.vo;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.LocalDateTimeToMilliSerializer;
import com.apitable.shared.support.serializer.NullArraySerializer;
import com.apitable.shared.support.serializer.NullNumberSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Template Center - Template Album Content View
 * </p>
 */
@Data
@EqualsAndHashCode(callSuper = true)
@ApiModel("Template Album Content View")
public class AlbumContentVo extends AlbumVo {

    @ApiModelProperty(value = "Albums Content", example = "This is the content about album.", position = 5)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String content;

    @ApiModelProperty(value = "Author Name", dataType = "java.lang.String", example = "1", position = 6)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String authorName;

    @ApiModelProperty(value = "Author Logo", example = "https://xxx.com/avator001.jpg", position = 7)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String authorLogo;

    @ApiModelProperty(value = "Author Description", example = "This is a description about author.", position = 8)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String authorDesc;

    @ApiModelProperty(value = "Template Tag List", example = "[\"aaa\", \"bbb\"]", position = 9)
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<String> tags;

    @ApiModelProperty(value = "creation time millisecond timestamp", dataType = "java.lang.Long", example = "1573561644000", position = 10)
    @JsonSerialize(using = LocalDateTimeToMilliSerializer.class, nullsUsing = NullNumberSerializer.class)
    private LocalDateTime createdAt;

}
