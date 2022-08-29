package com.vikadata.api.modular.finance.model;

import java.math.BigDecimal;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.enums.finance.OrderType;
import com.vikadata.api.support.serializer.BigDecimalSerializer;

/**
 * 订单预览
 * @author Shawn Deng
 * @date 2022-05-19 10:23:18
 */
@Data
public class OrderPreview {

    @ApiModelProperty(value = "空间标识", example = "spc2123s")
    private String spaceId;

    @ApiModelProperty(value = "订单类型", example = "BUY")
    private OrderType orderType;

    @ApiModelProperty(value = "订单金额(单位: 元)", example = "19998.21")
    @JsonSerialize(using = BigDecimalSerializer.class)
    private BigDecimal priceOrigin;

    @ApiModelProperty(value = "优惠金额(单位: 元)", example = "19998.21")
    @JsonSerialize(using = BigDecimalSerializer.class)
    private BigDecimal priceDiscount;

    @ApiModelProperty(value = "原方案未使用金额(单位: 元)", example = "19998.21")
    @JsonSerialize(using = BigDecimalSerializer.class)
    private BigDecimal priceUnusedCalculated;

    @ApiModelProperty(value = "支付金额(单位: 元)", example = "18998.11")
    @JsonSerialize(using = BigDecimalSerializer.class)
    private BigDecimal pricePaid;

    @ApiModelProperty(value = "货币代码", example = "CNY")
    private String currency;
}
