package com.vikadata.api.enterprise.billing.model;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * Create Oder Request Object
 * </p>
 */
@Data
@ApiModel("Create Oder Request Object")
public class CreateOrderRo {

    @NotBlank(message = "Space id is not allowed to be empty")
    @ApiModelProperty(value = "space id", example = "spc2123s")
    private String spaceId;

    @NotBlank(message = "Product type is not allowed to be empty")
    @ApiModelProperty(value = "product type", example = "SILVER")
    private String product;

    @NotNull(message = "The number of seats cannot be empty")
    @ApiModelProperty(value = "seat", example = "10")
    private Integer seat;

    @NotNull(message = "Month is not allowed to be empty")
    @Min(1)
    @ApiModelProperty(value = "month", example = "6")
    private Integer month;
}
