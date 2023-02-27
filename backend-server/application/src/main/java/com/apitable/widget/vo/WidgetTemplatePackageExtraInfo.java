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

package com.apitable.widget.vo;

import com.apitable.shared.support.serializer.ImageSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * <p>
 * Template Widget Package Information View.
 * </p>
 */
@Data
@Schema(description = "Template Widget Package Extension Information View")
public class WidgetTemplatePackageExtraInfo {

    @Schema(description = "Open source address", example = "https://apitable"
        + ".com/code/2020/12/23/aqa")
    @JsonSerialize(using = ImageSerializer.class)
    private String widgetOpenSource;

    @Schema(description = "Template Extension Cover", example = "https://apitable"
        + ".com/code/2020/12/23/aqa")
    @JsonSerialize(using = ImageSerializer.class)
    private String templateCover;

}
