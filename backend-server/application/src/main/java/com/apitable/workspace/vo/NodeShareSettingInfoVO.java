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

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.apitable.shared.support.serializer.NullArraySerializer;
import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullObjectSerializer;

/**
 * <p>
 * Node sharing setting information view
 * </p>
 */
@Data
@ApiModel("Node sharing setting information view")
public class NodeShareSettingInfoVO {

    @ApiModelProperty(value = "Node ID", example = "nod10", position = 1)
    private String nodeId;

    @ApiModelProperty(value = "Node Name", example = "This is a node", position = 2)
    private String nodeName;

    @ApiModelProperty(value = "Node icon", example = "smile", position = 3)
    private String nodeIcon;

    @ApiModelProperty(value = "Whether to enable share", example = "true", position = 4)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean shareOpened;

    @ApiModelProperty(value = "Node share setting options", position = 5)
    @JsonSerialize(nullsUsing = NullObjectSerializer.class)
    private NodeShareSettingPropsVO props;

    @ApiModelProperty(value = "Share unique code", example = "shrKsX1map5RfYO", position = 6)
    private String shareId;

    @ApiModelProperty(value = "Association Table", position = 7)
    @JsonSerialize(nullsUsing = NullArraySerializer.class, using = NullArraySerializer.class)
    private List<String> linkNodes;

    @ApiModelProperty(value = "Whether the node (including children) contains member fields", example = "true", position = 8)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean containMemberFld;

    @ApiModelProperty(value = "Open the sharer", example = "Zhang San", position = 9)
    private String shareOpenOperator;

    @ApiModelProperty(value = "Does the sharer have node permissions", example = "true", position = 10)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean operatorHasPermission;
}
