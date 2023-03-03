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

import com.apitable.shared.support.serializer.NullArraySerializer;
import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullObjectSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

/**
 * <p>
 * Node sharing setting information view.
 * </p>
 */
@Data
@Schema(description = "Node sharing setting information view")
public class NodeShareSettingInfoVO {

    @Schema(description = "Node ID", example = "nod10")
    private String nodeId;

    @Schema(description = "Node Name", example = "This is a node")
    private String nodeName;

    @Schema(description = "Node icon", example = "smile")
    private String nodeIcon;

    @Schema(description = "Whether to enable share", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean shareOpened;

    @Schema(description = "Node share setting options")
    @JsonSerialize(nullsUsing = NullObjectSerializer.class)
    private NodeShareSettingPropsVO props;

    @Schema(description = "Share unique code", example = "shrKsX1map5RfYO")
    private String shareId;

    @Schema(description = "Association Table")
    @JsonSerialize(nullsUsing = NullArraySerializer.class, using = NullArraySerializer.class)
    private List<String> linkNodes;

    @Schema(description = "Whether the node (including children) contains member fields",
        example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean containMemberFld;

    @Schema(description = "Open the sharer", example = "Zhang San")
    private String shareOpenOperator;

    @Schema(description = "Does the sharer have node permissions", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean operatorHasPermission;
}
