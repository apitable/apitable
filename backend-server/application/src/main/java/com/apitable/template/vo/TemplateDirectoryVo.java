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

import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import com.apitable.workspace.vo.NodeShareTree;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Template Catalog View.
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Schema(description = "Template Catalog View")
public class TemplateDirectoryVo {

    @Schema(description = "Template ID", example = "tplHTbkg7qbNJ")
    private String templateId;

    @Schema(description = "Template classification code", example = "tpcCq88sqNqEv")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String categoryCode;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @Schema(description = "Template Classification Name", example = "TV play")
    private String categoryName;

    @Schema(description = "Template Name", example = "This is a template")
    private String templateName;

    @Schema(description = "Node tree of template mapping")
    private NodeShareTree nodeTree;

    @Schema(description = "Creator user ID (the actual return is uuid)",
        type = "java.lang.String", example = "1")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String userId;

    @Schema(description = "Creator User UUID", type = "java.lang.String", example = "1")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String uuid;

    @Schema(description = "Creator's avatar", example = "public/2020/...")
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String avatar;

    @Schema(description = "Creator nickname", example = "Zhang San")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String nickName;

    @Schema(description = "Space name", example = "station")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String spaceName;
}
