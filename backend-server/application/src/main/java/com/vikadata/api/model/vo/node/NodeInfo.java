package com.vikadata.api.model.vo.node;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * Node Information View
 * </p>
 */
@Data
@ApiModel("Node Information View")
@EqualsAndHashCode(callSuper = true)
public class NodeInfo extends BaseNodeInfo {

    @ApiModelProperty(value = "Node icon", example = ":smile", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String icon;
}
