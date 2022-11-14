package com.vikadata.api.workspace.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Node Transfer Result View
 * </p>
 */
@Data
@ApiModel("Node Transfer Result View")
public class StoreNodeInfoVO {

    @ApiModelProperty(value = "New Node ID", example = "nod2818jsak", position = 1)
    private String nodeId;
}
