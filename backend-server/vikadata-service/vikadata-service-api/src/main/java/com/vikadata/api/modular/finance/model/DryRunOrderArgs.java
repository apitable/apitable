package com.vikadata.api.modular.finance.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * 试运行订单参数
 * </p> 
 * @author Shawn Deng 
 * @date 2022/2/15 20:46
 */
@Data
@ApiModel("试运行订单参数")
public class DryRunOrderArgs {

    @ApiModelProperty(value = "运行类型", example = "SUBSCRIPTION_ACTION", hidden = true)
    private String dryRunType = "SUBSCRIPTION_ACTION";

    @ApiModelProperty(value = "运行类型动作", example = "UPGRADE")
    private String action;

    @NotBlank(message = "空间ID不允许为空")
    @ApiModelProperty(value = "空间标识", example = "spc2123s")
    private String spaceId;

    @ApiModelProperty(value = "产品类型", example = "SILVER")
    private String product;

    @ApiModelProperty(value = "席位数", example = "10")
    private Integer seat;

    @ApiModelProperty(value = "月份", example = "6")
    private Integer month;
}
