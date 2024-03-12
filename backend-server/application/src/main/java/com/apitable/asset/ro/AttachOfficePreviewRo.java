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

package com.apitable.asset.ro;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Attachment preview request parameter ro.
 * </p>
 */
@Data
@Schema(description = "Attachment preview request parameter ro")
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class AttachOfficePreviewRo {

    /**
     * Cloud file storage path.
     */
    @NotBlank(message = "Cloud file storage path")
    @Schema(description = "Cloud file name/key", example = "space/2020/03/27/1243592950910349313")
    private String token;


    @NotBlank(message = "Source file name and suffix of cloud files")
    @Schema(description = "Source file name and suffix of cloud files",
        example = "Leida Team Books.xls")
    private String attname;

}
