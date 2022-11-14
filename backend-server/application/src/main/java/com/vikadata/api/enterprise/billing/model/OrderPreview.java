package com.vikadata.api.enterprise.billing.model;

import java.math.BigDecimal;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.enterprise.billing.enums.OrderType;
import com.vikadata.api.shared.support.serializer.BigDecimalSerializer;

/**
 * <p>
 * Order Preview
 * </p>
 */
@Data
public class OrderPreview {

    @ApiModelProperty(value = "space id", example = "spc2123s")
    private String spaceId;

    @ApiModelProperty(value = "order type", example = "BUY")
    private OrderType orderType;

    @ApiModelProperty(value = "order amount (Unit: Yuan)", example = "19998.21")
    @JsonSerialize(using = BigDecimalSerializer.class)
    private BigDecimal priceOrigin;

    @ApiModelProperty(value = "discount amount (unit: yuan)", example = "19998.21")
    @JsonSerialize(using = BigDecimalSerializer.class)
    private BigDecimal priceDiscount;

    @ApiModelProperty(value = "unused amount of the original plan (unit: yuan)", example = "19998.21")
    @JsonSerialize(using = BigDecimalSerializer.class)
    private BigDecimal priceUnusedCalculated;

    @ApiModelProperty(value = "payment amount (unit: yuan)", example = "18998.11")
    @JsonSerialize(using = BigDecimalSerializer.class)
    private BigDecimal pricePaid;

    @ApiModelProperty(value = "currency code", example = "CNY")
    private String currency;
}
