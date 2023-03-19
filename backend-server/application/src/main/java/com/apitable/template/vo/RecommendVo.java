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

import com.apitable.shared.cache.bean.Banner;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

/**
 * Template Center - Recommend View.
 *
 * @author Chambers
 */
@Data
@Schema(description = "Recommend View")
public class RecommendVo {

    @Schema(description = "Top Banner")
    private List<Banner> top;

    @Schema(description = "Custom Albums Groups")
    private List<AlbumGroupVo> albumGroups;

    @Schema(description = "Custom Template Groups")
    private List<TemplateGroupVo> templateGroups;
}
