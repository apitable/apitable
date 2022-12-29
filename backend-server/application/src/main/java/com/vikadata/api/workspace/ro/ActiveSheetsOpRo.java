package com.vikadata.api.workspace.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Active node request parameters
 * </p>
 */
@Data
@ApiModel("Active node request parameters")
public class ActiveSheetsOpRo {

    @ApiModelProperty(value = "Active node id", example = "dst15", position = 1)
    private String nodeId;

    @ApiModelProperty(value = "View ID of active number table", example = "views135", position = 2)
    private String viewId;

    @ApiModelProperty(value = "Location (0: working directory; 1: star)", example = "1", position = 3)
    private Integer position;

}
