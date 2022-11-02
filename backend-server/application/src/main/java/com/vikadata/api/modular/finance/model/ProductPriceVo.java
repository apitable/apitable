package com.vikadata.api.modular.finance.model;

import java.math.BigDecimal;
import java.util.Locale;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.util.billing.model.BillingPlanPrice;

import static com.vikadata.api.util.billing.OrderUtil.toCurrencyUnit;

/**
 * <p>
 * Product Price View
 * </p>
 */
@Data
@ApiModel("Product Price View")
public class ProductPriceVo {

    @ApiModelProperty(value = "production type", example = "SILVER")
    private String product;

    @ApiModelProperty(value = "price id", example = "price_dasx1212cas")
    private String priceId;

    @ApiModelProperty(value = "seat", example = "10")
    private Integer seat;

    @ApiModelProperty(value = "month", example = "6")
    private Integer month;

    @ApiModelProperty(value = "discount amount (unit: yuan)", example = "999.99")
    private BigDecimal priceDiscount;

    @ApiModelProperty(value = "original price (unit: yuan)", example = "19998.11")
    private BigDecimal priceOrigin;

    @ApiModelProperty(value = "p`ayment amount (unit: yuan)", example = "18998.11")
    private BigDecimal pricePaid;

    public static ProductPriceVo fromPrice(BillingPlanPrice planPrice) {
        ProductPriceVo vo = new ProductPriceVo();
        vo.setProduct(planPrice.getProduct().toUpperCase(Locale.ROOT));
        vo.setPriceId(planPrice.getPriceId());
        vo.setSeat(planPrice.getSeat());
        vo.setMonth(planPrice.getMonth());
        vo.setPriceOrigin(toCurrencyUnit(planPrice.getOrigin()));
        vo.setPriceDiscount(toCurrencyUnit(planPrice.getDiscount()));
        vo.setPricePaid(toCurrencyUnit(planPrice.getActual()));
        return vo;
    }
}
