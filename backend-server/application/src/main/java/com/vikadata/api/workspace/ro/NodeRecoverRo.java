package com.vikadata.api.workspace.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * <p>
 * Node recovery request parameters
 * </p>
 */
@Data
@ApiModel("Node recovery request parameters")
public class NodeRecoverRo {

    @ApiModelProperty(value = "Node Id", example = "nod10", position = 1, required = true)
    @NotBlank(message = "Node Id cannot be empty")
    private String nodeId;

    @ApiModelProperty(value = "Parent Node Id of the target location", example = "nod10", position = 2)
    private String parentId;
}
