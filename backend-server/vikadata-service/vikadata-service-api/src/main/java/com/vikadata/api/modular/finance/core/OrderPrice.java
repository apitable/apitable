package com.vikadata.api.modular.finance.core;

import java.math.BigDecimal;

/**
 * Order Price
 */
public class OrderPrice {

    private final BigDecimal priceOrigin;

    private final BigDecimal priceDiscount;

    private final BigDecimal priceUnusedCalculated;

    private BigDecimal pricePaid;

    public OrderPrice(BigDecimal priceOrigin, BigDecimal priceDiscount, BigDecimal priceUnusedCalculated, BigDecimal pricePaid) {
        this.priceOrigin = priceOrigin;
        this.priceDiscount = priceDiscount;
        this.priceUnusedCalculated = priceUnusedCalculated;
        this.pricePaid = pricePaid;
    }

    public BigDecimal getPriceOrigin() {
        return priceOrigin;
    }

    public BigDecimal getPriceDiscount() {
        return priceDiscount;
    }

    public BigDecimal getPriceUnusedCalculated() {
        return priceUnusedCalculated;
    }

    public void setPricePaid(BigDecimal pricePaid) {
        this.pricePaid = pricePaid;
    }

    public BigDecimal getPricePaid() {
        return pricePaid;
    }
}
