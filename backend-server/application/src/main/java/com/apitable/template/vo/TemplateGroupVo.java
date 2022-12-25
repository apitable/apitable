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
import lombok.Data;
import lombok.NoArgsConstructor;

import com.apitable.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Template Center - Recommend Custom Template Group View
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Recommend Custom Template Group View")
public class TemplateGroupVo {

    @ApiModelProperty(value = "Template Group Name", example = "Other Users Also Like", position = 1)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String name;

    @ApiModelProperty(value = "Template View List", position = 2)
    private List<TemplateVo> templates;

    @Deprecated
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String categoryName;

    @Deprecated
    private List<TemplateVo> templateVos;

    public TemplateGroupVo(String name, List<TemplateVo> templates) {
        this.name = name;
        this.templates = templates;
        this.categoryName = name;
        this.templateVos = templates;
    }
}
