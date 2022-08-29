package com.vikadata.api.modular.finance.model;

import java.math.BigDecimal;
import java.util.Locale;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.util.billing.model.BillingPlanPrice;

import static com.vikadata.api.util.billing.OrderUtil.toCurrencyUnit;

/**
 * 产品方案价格视图
 *
 * @author Shawn Deng
 */
@Data
@ApiModel("产品方案价格视图")
public class ProductPriceVo {

    @ApiModelProperty(value = "产品类型", example = "SILVER")
    private String product;

    @ApiModelProperty(value = "产品方案", example = "price_dasx1212cas")
    private String priceId;

    @ApiModelProperty(value = "席位数", example = "10")
    private Integer seat;

    @ApiModelProperty(value = "月份", example = "6")
    private Integer month;

    @ApiModelProperty(value = "优惠金额(单位: 元)", example = "999.99")
    private BigDecimal priceDiscount;

    @ApiModelProperty(value = "原价(单位: 元)", example = "19998.11")
    private BigDecimal priceOrigin;

    @ApiModelProperty(value = "支付金额(单位: 元)", example = "18998.11")
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
