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

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.NullArraySerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Template View
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Template View")
public class TemplateVo {

    @ApiModelProperty(value = "Template ID", example = "tplHTbkg7qbNJ", position = 1)
    private String templateId;

    @ApiModelProperty(value = "Template Name", example = "This is a template", position = 2)
    private String templateName;

    @ApiModelProperty(value = "Node Id of template mapping", example = "nod10", position = 3)
    private String nodeId;

    @ApiModelProperty(value = "Node Type", example = "1", position = 4)
    private Integer nodeType;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "Cover", example = "http://...", position = 5)
    private String cover;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "Describe", example = "This is a showcase", position = 6)
    private String description;

    @ApiModelProperty(value = "Creator user ID (the actual return is uuid)", dataType = "java.lang.String", example = "1", position = 6)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String userId;

    @ApiModelProperty(value = "Creator User UUID", dataType = "java.lang.String", example = "1", position = 6)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String uuid;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "Creator's avatar", example = "public/2020/...", position = 7)
    private String avatar;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "Creator nickname", example = "Zhang San", position = 8)
    private String nickName;

    @ApiModelProperty(value = "Whether the user has modified the nickname", position = 9)
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "Template label", example = "[\"aaa\", \"bbb\"]", position = 10)
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<String> tags;

}
