package com.vikadata.api.enterprise.vcode.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * Request parameters of V code coupon template
 * </p>
 */
@Data
@ApiModel("Request parameters of V code coupon template")
public class VCodeCouponRo {

    @ApiModelProperty(value = "Exchange amount", example = "10", position = 1, required = true)
    @NotNull(message = "The exchange amount cannot be blank")
    private Integer count;

    @ApiModelProperty(value = "Remarks", example = "Seed user benefit exchange template", position = 2)
    private String comment;

}
