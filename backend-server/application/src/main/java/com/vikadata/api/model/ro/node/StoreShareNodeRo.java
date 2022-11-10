package com.vikadata.api.model.ro.node;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * <p>
 * Transfer sharing node request parameters
 * </p>
 */
@Data
@ApiModel("Transfer sharing node request parameters")
public class StoreShareNodeRo {

    @NotBlank(message = "Space ID cannot be empty")
    @ApiModelProperty(value = "Space ID", example = "spc20cjiwis2", position = 1)
    private String spaceId;

    @NotBlank(message = "The share ID cannot be empty")
    @ApiModelProperty(value = "Share ID", example = "shrSJ921CNsj", position = 2)
    private String shareId;
}
