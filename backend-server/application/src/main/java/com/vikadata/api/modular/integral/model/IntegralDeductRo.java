package com.vikadata.api.modular.integral.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("Integral Deduct Ro")
public class IntegralDeductRo {

    @ApiModelProperty(value = "userId", example = "12511", position = 1)
    private Long userId;

    @ApiModelProperty(value = "areaCode", example = "+86", position = 2)
    private String areaCode;

    @ApiModelProperty(value = "account credential（mobile phone or email）", example = "xx@gmail.com", position = 3)
    private String credential;

    @ApiModelProperty(value = "the value of the deduction", example = "100", required = true, position = 4)
    private Integer credit;
}
