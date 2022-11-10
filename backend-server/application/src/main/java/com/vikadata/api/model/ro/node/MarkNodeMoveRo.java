package com.vikadata.api.model.ro.node;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * <p>
 * Star mark node move request parameters
 * </p>
 */
@Data
@ApiModel("Star mark node move request parameters")
public class MarkNodeMoveRo {

    @ApiModelProperty(value = "Node Id", example = "nod10", position = 1, required = true)
    @NotBlank(message = "Node Id cannot be empty")
    private String nodeId;

    @ApiModelProperty(value = "The previous node of the target position moves to the first position when it is empty", example = "nod10", position = 2)
    private String preNodeId;
}
