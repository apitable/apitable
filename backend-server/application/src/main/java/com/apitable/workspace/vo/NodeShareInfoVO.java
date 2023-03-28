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

package com.apitable.workspace.vo;

import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * <p>
 * Node share information view.
 * </p>
 */
@Data
@Schema(description = "Node share information view")
public class NodeShareInfoVO {

    @Schema(description = "Share Unique ID", example = "shrKsX1map5RfYO")
    private String shareId;

    @Schema(description = "Space ID", example = "spceDumyiMKU2")
    private String spaceId;

    @Schema(description = "Space name", example = "space")
    private String spaceName;

    @Schema(description = "Shared node tree")
    private NodeShareTree shareNodeTree;

    @Schema(description = "Allow others to deposit", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean allowSaved;

    @Schema(description = "Allow others to edit", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean allowEdit;

    @Schema(description = "Whether to allow others to apply for joining the space",
        example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean allowApply;

    @Schema(description = "Whether to allow others to copy data outside the station",
        example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean allowCopyDataToExternal;

    @Schema(description = "Allow others to download attachments", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean allowDownloadAttachment;

    @Schema(description = "Last Modified By", example = "Zhang San")
    private String lastModifiedBy;

    @Schema(description = "Head portrait address",
        example = "http://wwww.apitable.com/2019/11/12/17123187253.png")
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String lastModifiedAvatar;

    @Schema(description = "Login or not", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean hasLogin;

    @Schema(description = "Whether to open「View manual save」Experimental function",
        example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean featureViewManualSave;

    @Schema(description = "is deleted", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isDeleted;
}
