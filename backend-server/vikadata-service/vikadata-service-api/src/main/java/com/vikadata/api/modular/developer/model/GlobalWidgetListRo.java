package com.vikadata.api.modular.developer.model;

import javax.validation.constraints.NotEmpty;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("Global widget list Ro")
public class GlobalWidgetListRo {

    @ApiModelProperty(value = "the node id", required = true, position = 1)
    @NotEmpty(message = "The node id cannot be empty")
    private String nodeId;

}
