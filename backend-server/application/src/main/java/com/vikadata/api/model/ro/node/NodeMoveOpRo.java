package com.vikadata.api.model.ro.node;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * Node move request parameters
 */
@Data
@ApiModel("Node move request parameters")
public class NodeMoveOpRo {

    @ApiModelProperty(value = "Node Id", example = "nod10", position = 1, required = true)
    @NotBlank(message = "Node Id cannot be empty")
    private String nodeId;

    @ApiModelProperty(value = "Parent Node Id of the target location", example = "nod10", position = 2, required = true)
	@NotBlank(message = "The parent node ID cannot be empty")
    private String parentId;

    @ApiModelProperty(value = "The previous node of the target position moves to the first position when it is empty", example = "nod10", position = 3)
    private String preNodeId;
}
