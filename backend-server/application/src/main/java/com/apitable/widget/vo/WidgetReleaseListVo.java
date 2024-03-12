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
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * <p>
 * Widget Release Version History View.
 * </p>
 */
@Data
@Schema(description = "Widget Release Version History View")
public class WidgetReleaseListVo {

    @Schema(description = "Publish this Sha value")
    private String releaseSha;

    @Schema(description = "EDITION", example = "1.0.0")
    private String version;

    @Schema(description = "Status (0: to be approved, 1: approved, 2: rejected)", example = "1")
    private Integer status;

    @Schema(description = "Code Address", example = "https://aitable.ai/code/2020/12/23/aqa")
    @JsonSerialize(using = ImageSerializer.class)
    private String releaseCodeBundle;

    @Schema(description = "Source code address", example = "https://aitable.ai/code/2020/12/23/aqa")
    @JsonSerialize(using = ImageSerializer.class)
    private String sourceCodeBundle;

    @Schema(description = "Current release version")
    private Boolean currentVersion;

    @Schema(hidden = true)
    @JsonIgnore
    private Long releaseId;

}
