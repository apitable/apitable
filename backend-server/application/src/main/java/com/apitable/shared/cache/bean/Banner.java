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

import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Template Center - Recommend Top Banner View.
 * </p>
 *
 * @author Chambers
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Banner View")
public class Banner {

    @Schema(description = "Template ID", example = "tplumddN5Cs5p")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String templateId;

    @Schema(description = "Banner Image", example = "https://xxx.com/cover001.jpg")
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String image;

    @Schema(description = "Title", example = "OKR Tracking")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String title;

    @Schema(description = "Description", example = "It is an useful tool to keep tracking "
        + "everyone's OKRs on your team.")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String desc;

    @Schema(description = "Font Color", example = "#000000")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String color;
}
