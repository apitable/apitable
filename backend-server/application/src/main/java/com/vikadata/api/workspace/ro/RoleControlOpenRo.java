package com.vikadata.api.workspace.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * Node and field role control opening request parameters
 */
@Data
@ApiModel("Space Management - Node and Field Role Control Open Request Parameters")
public class RoleControlOpenRo {

    @ApiModelProperty(value = "Inherit role when opening", example = "true", position = 1)
    private Boolean includeExtend;

}
