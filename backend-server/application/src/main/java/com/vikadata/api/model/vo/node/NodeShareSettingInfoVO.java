package com.vikadata.api.model.vo.node;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.NullArraySerializer;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullObjectSerializer;

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
