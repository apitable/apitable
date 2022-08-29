package com.vikadata.api.modular.finance.model;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * 创建订单视图
 * </p> 
 * @author Shawn Deng 
 * @date 2022/2/15 20:46
 */
@Data
@ApiModel("创建订单视图")
public class CreateOrderRo {

    @NotBlank(message = "空间ID不允许为空")
    @ApiModelProperty(value = "空间标识", example = "spc2123s")
    private String spaceId;

    @NotBlank(message = "产品类型不允许为空")
    @ApiModelProperty(value = "产品类型", example = "SILVER")
    private String product;

    @NotNull(message = "席位数不允许为空")
    @ApiModelProperty(value = "席位数", example = "10")
    private Integer seat;

    @NotNull(message = "月份不允许为空")
    @Min(1)
    @ApiModelProperty(value = "月份", example = "6")
    private Integer month;
}
