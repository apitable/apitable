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

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.apitable.shared.cache.bean.Banner;

/**
 * <p>
 * Template Center - Recommend View
 * </p>
 */
@Data
@ApiModel("Recommend View")
public class RecommendVo {

    @ApiModelProperty(value = "Top Banner", position = 1)
    private List<Banner> top;

    @ApiModelProperty(value = "Custom Albums Groups", position = 2)
    private List<AlbumGroupVo> albumGroups;

    @ApiModelProperty(value = "Custom Template Groups", position = 3)
    private List<TemplateGroupVo> templateGroups;

    @Deprecated
    private List<TemplateGroupVo> categories;
}
