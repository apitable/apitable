package com.vikadata.api.modular.developer.model;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("Placing Business Order Ro")
public class CreateBusinessOrderRo {

    @NotBlank(message = "The space ID cannot be blank")
    @ApiModelProperty(value = "Space Id", required = true, example = "spcNrqN2iH0qK")
    private String spaceId;

    @NotBlank(message = "The order type cannot be blank")
    @ApiModelProperty(value = "Order type", required = true, example = "BUY")
    private String type;

    @ApiModelProperty(value = "Product", example = "Enterprise")
    private String product;

    @ApiModelProperty(value = "Seat", example = "price_s2sf3f232skad")
    private Integer seat;

    @ApiModelProperty(value = "Privilege start date. If null, it means today start, such as renew subscription", example = "2021-10-20")
    private String startDate;

    @Min(1)
    @ApiModelProperty(value = "The subscription length(unit: month)", example = "1")
    private int months = 1;

    @ApiModelProperty(value = "Remark", example = "Optionally, it can describe the specificities of this order")
    private String remark;
}
