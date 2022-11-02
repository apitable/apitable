package com.vikadata.api.modular.finance.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("Trial order parameters")
public class DryRunOrderArgs {

    @ApiModelProperty(value = "run type", example = "SUBSCRIPTION_ACTION", hidden = true)
    private String dryRunType = "SUBSCRIPTION_ACTION";

    @ApiModelProperty(value = "run type action", example = "UPGRADE")
    private String action;

    @NotBlank(message = "Space id is not allowed to be empty")
    @ApiModelProperty(value = "space id", example = "spc2123s")
    private String spaceId;

    @ApiModelProperty(value = "production type", example = "SILVER")
    private String product;

    @ApiModelProperty(value = "seat", example = "10")
    private Integer seat;

    @ApiModelProperty(value = "month", example = "6")
    private Integer month;
}
