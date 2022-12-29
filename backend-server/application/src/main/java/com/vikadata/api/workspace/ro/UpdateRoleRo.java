package com.vikadata.api.workspace.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.util.List;

/**
 * <p>
 * Modify node role request parameters
 * </p>
 */
@Data
@ApiModel("Modify node role request parameters")
public class UpdateRoleRo {

    @NotBlank(message = "Node ID cannot be empty")
    @ApiModelProperty(value = "Node ID", example = "nod10", position = 1)
    private String nodeId;

    @ApiModelProperty(value = "The node role inherits the parent mode. If it is false, the roles parameter needs to be passed", example = "false", position = 2)
    private Boolean extend;

    private List<NodeRoleRo> roles;
}
