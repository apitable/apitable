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
import java.util.List;
import lombok.Data;

/**
 * Attach Audit Callback Ro.
 */
@Data
@Schema(description = "Image review result request parameters")
public class AttachAuditCallbackRo {

    @Schema(description = "Persistent ID of processing task",
        requiredMode = RequiredMode.REQUIRED)
    @NotNull
    private String id;

    @Schema(description = "Processing queue name",
        requiredMode = RequiredMode.REQUIRED)
    @NotNull
    private String pipeline;

    @Schema(description = "Status code 0 succeeded, 1 waiting for processing, 2 processing, 3 "
        + "processing failed, 4 notification submission failed",
        requiredMode = RequiredMode.REQUIRED)
    @NotNull
    private Integer code;

    @Schema(description = "Detailed description corresponding to the status code",
        requiredMode = RequiredMode.REQUIRED)
    @NotNull
    private String desc;

    @Schema(description = "The request ID of the cloud processing request is mainly used for "
        + "troubleshooting by Qiniu technicians", requiredMode = RequiredMode.REQUIRED)
    @NotNull
    private String reqid;

    @Schema(description = "The name of the space where the source file is processed",
        requiredMode = RequiredMode.REQUIRED)
    @NotNull
    private String inputBucket;

    @Schema(description = "File name of processing source file",
        requiredMode = RequiredMode.REQUIRED)
    @NotNull
    private String inputKey;

    @Schema(description = "Callback results after file processing",
        requiredMode = RequiredMode.REQUIRED)
    @NotNull
    private List<AttachAuditItemsRo> items;
}
