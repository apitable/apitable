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

import com.apitable.shared.support.serializer.NullArraySerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

/**
 * <p>
 * Template Search Results.
 * </p>
 */
@Data
@Schema(description = "Template Search Results")
public class TemplateSearchResult {

    @Schema(description = "Template ID", example = "tplHTbkg7qbNJ")
    private String templateId;

    @Schema(description = "Template Name", example = "This is a template")
    private String templateName;

    @Schema(description = "Template classification code", example = "tpcCq88sqNqEv")
    private String categoryCode;

    @Schema(description = "Template Classification Name", example = "TV play")
    private String categoryName;

    @Schema(description = "Label Name", example = "TV play")
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<String> tags;

}
