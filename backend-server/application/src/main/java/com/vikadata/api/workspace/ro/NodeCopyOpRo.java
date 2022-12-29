package com.vikadata.api.workspace.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * Node replication request parameters
 */
@Data
@ApiModel("Node replication request parameters")
public class NodeCopyOpRo {

    @ApiModelProperty(value = "Node Id", example = "nod10", position = 1, required = true)
    @NotBlank(message = "Node Id cannot be empty")
    private String nodeId;

    @ApiModelProperty(value = "Need to copy data", example = "true", position = 4)
    private Boolean data;
}
