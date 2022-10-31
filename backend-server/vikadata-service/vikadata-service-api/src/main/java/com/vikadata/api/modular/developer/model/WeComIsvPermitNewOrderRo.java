package com.vikadata.api.modular.developer.model;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("WeCom Isv Permit New Order Ro")
public class WeComIsvPermitNewOrderRo {

    @ApiModelProperty("license space to activate")
    @NotBlank
    private String spaceId;

    @ApiModelProperty("the number of months to purchase the account. take 31 days as a month, max 36 months")
    @NotNull
    @Min(1)
    @Max(36)
    private Integer durationMonths;

}
