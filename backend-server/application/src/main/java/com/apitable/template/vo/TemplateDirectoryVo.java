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

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.apitable.workspace.vo.NodeShareTree;
import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Template Catalog View
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Template Catalog View")
public class TemplateDirectoryVo {

    @ApiModelProperty(value = "Template ID", example = "tplHTbkg7qbNJ", position = 1)
    private String templateId;

    @ApiModelProperty(value = "Template classification code", example = "tpcCq88sqNqEv", position = 2)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String categoryCode;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "Template Classification Name", example = "TV play", position = 2)
    private String categoryName;

    @ApiModelProperty(value = "Template Name", example = "This is a template", position = 2)
    private String templateName;

    @ApiModelProperty(value = "Node tree of template mapping", position = 7)
    private NodeShareTree nodeTree;

    @ApiModelProperty(value = "Creator user ID (the actual return is uuid)", dataType = "java.lang.String", example = "1", position = 8)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String userId;

    @ApiModelProperty(value = "Creator User UUID", dataType = "java.lang.String", example = "1", position = 8)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String uuid;

    @ApiModelProperty(value = "Creator's avatar", example = "public/2020/...", position = 9)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String avatar;

    @ApiModelProperty(value = "Creator nickname", example = "Zhang San", position = 10)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String nickName;

    @ApiModelProperty(value = "Space name", example = "station", position = 11)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String spaceName;
}
