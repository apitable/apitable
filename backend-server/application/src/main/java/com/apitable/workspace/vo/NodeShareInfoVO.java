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
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Node share information view
 * </p>
 */
@Data
@ApiModel("Node share information view")
public class NodeShareInfoVO {

    @ApiModelProperty(value = "Share Unique ID", example = "shrKsX1map5RfYO", position = 1)
    private String shareId;

    @ApiModelProperty(value = "Space ID", example = "spceDumyiMKU2", position = 2)
    private String spaceId;

    @ApiModelProperty(value = "Space name", example = "space", position = 3)
    private String spaceName;

    @ApiModelProperty(value = "Shared node tree", position = 4)
    private NodeShareTree shareNodeTree;

    @ApiModelProperty(value = "Allow others to deposit", example = "true", position = 7)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean allowSaved;

    @ApiModelProperty(value = "Allow others to edit", example = "true", position = 7)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean allowEdit;

    @ApiModelProperty(value = "Whether to allow others to apply for joining the space",
        example = "true", position = 7)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean allowApply;

    @ApiModelProperty(value = "Whether to allow others to copy data outside the station",
        example = "true", position = 8)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean allowCopyDataToExternal;

    @ApiModelProperty(value = "Allow others to download attachments", example = "true",
        position = 9)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean allowDownloadAttachment;

    @ApiModelProperty(value = "Last Modified By", example = "Zhang San", position = 12)
    private String lastModifiedBy;

    @ApiModelProperty(value = "Head portrait address",
        example = "http://wwww.apitable.com/2019/11/12/17123187253.png", position = 13)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String lastModifiedAvatar;

    @ApiModelProperty(value = "Login or not", example = "false", position = 14)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean hasLogin;

    @ApiModelProperty(value = "Whether to open「View manual save」Experimental function",
        example = "true", position = 15)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean featureViewManualSave;

    @ApiModelProperty(value = "is deleted", example = "true", position = 16)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isDeleted;
}
