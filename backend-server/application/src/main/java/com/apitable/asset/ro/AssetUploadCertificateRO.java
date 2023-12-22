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
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Attachment resource upload certificate RO.
 */
@Data
@Schema(description = "Attachment resource upload certificate RO")
public class AssetUploadCertificateRO {

    @Schema(description = "Number of credentials created default 1 max 100")
    @Min(value = 1, message = "min wrong count")
    @Max(value = 20, message = "max wrong count")
    private Integer count = 1;

    @Schema(description = "Asset Type(0:user avatar;1:space logo;2:datasheet;"
        + " 3:cover image;4:node description;5:document)",
        example = "0", requiredMode = RequiredMode.REQUIRED)
    @NotNull(message = "Type cannot be null")
    private Integer type;

    @Schema(description = "Node Id (data table attachment, cover image and node description must "
        + "be passed)", example = "dst10")
    private String nodeId;

    @Schema(description = "Password login man-machine verification, the front end obtains the "
        + "value of the get NVC Val function (man-machine verification will be performed when not"
        + " logged in)", example = "FutureIsComing")
    private String data;

}
