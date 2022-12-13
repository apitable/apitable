package com.vikadata.api.internal.ro;

import java.util.List;

import javax.validation.constraints.NotEmpty;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("Internal Interface - Permission Request Parameters")
public class InternalPermissionRo {

    @ApiModelProperty(value = "Node ID list", required = true, example = "[\"fomtujwf5eSWKiMaVw\",\"dstbw4CZFURbchgP17\"]", position = 1)
    @NotEmpty(message = "Node ID list cannot be empty")
    private List<String> nodeIds;

    @ApiModelProperty(value = "Node Share Id", dataType = "java.lang.String", example = "shr8T8vAfehg3yj3McmDG", position = 2)
    private String shareId;

    @ApiModelProperty(value = "User Id", dataType = "java.lang.String", example = "usrddddd", position = 3)
    private String userId;
}
