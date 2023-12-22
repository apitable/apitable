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
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

/**
 * <p>
 * Attachment Request Parameters.
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Schema(description = "Attachment Request Parameters")
public class AttachOpRo {

    @Schema(description = "Upload files", requiredMode = RequiredMode.REQUIRED)
    @NotNull(message = "File cannot be empty")
    private MultipartFile file;

    @Schema(description = "Type (0: user profile; 1: space logo; 2: data table attachment; 3: "
        + "cover map; 4: node description)", example = "0", requiredMode = RequiredMode.REQUIRED)
    @NotNull(message = "Type cannot be empty")
    private Integer type;

    @Schema(description = "Node Id (data table attachment, cover map and node description must be"
        + " transferred)", example = "dst10")
    private String nodeId;

    @Schema(description = "Password login for human-machine verification, and the front end "
        + "obtains the value of get NVC Val function (human-machine verification will be performed "
        + "when not logged in)", example = "FutureIsComing")
    private String data;
}
