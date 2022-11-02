package com.vikadata.api.util.billing.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.vikadata.system.config.billing.Event;
import com.vikadata.system.config.billing.Price;
import com.vikadata.system.config.billing.PriceList;

import static com.vikadata.api.util.billing.BillingConfigManager.getByEventId;
import static com.vikadata.api.util.billing.BillingConfigManager.getByPriceListId;

public class BillingPlanPrice {

    private final Price price;

    private final BigDecimal discount;

    private final BigDecimal actual;

    public BillingPlanPrice(Price price, LocalDate now) {
        this.price = price;
        this.discount = calculateDiscount(price, now);
        this.actual = price.getOriginPrice() != null && price.getOriginPrice().compareTo(BigDecimal.ZERO) > 0 ?
                price.getOriginPrice().subtract(this.discount) : BigDecimal.ZERO;
    }

    private BigDecimal calculateDiscount(Price price, LocalDate now) {
        if (price.getPriceListId() == null) {
            return BigDecimal.ZERO;
        }
        PriceList priceList = getByPriceListId(price.getPriceListId());
        if (priceList == null) {
            return BigDecimal.ZERO;
        }
        Event event = getByEventId(priceList.getEvent());
        if (event == null) {
            return BigDecimal.ZERO;
        }
        if (event.getStartDate() != null && event.getStartDate().compareTo(now) > 0) {
            return BigDecimal.ZERO;
        }
        if (event.getEndDate() != null && event.getEndDate().compareTo(now) < 0) {
            return BigDecimal.ZERO;
        }
        if (priceList.getDiscountAmount() == null) {
            return BigDecimal.ZERO;
        }
        return priceList.getDiscountAmount();
    }

    public static BillingPlanPrice of(Price price, LocalDate now) {
        return new BillingPlanPrice(price, now);
    }

    public String getPriceId() {
        return price.getId();
    }

    public String getGoodEnTitle() {
        return price.getGoodEnTitle();
    }

    public String getGoodChTitle() {
        return price.getGoodChTitle();
    }

    public String getPlanId() {
        return price.getPlanId();
    }

    public Integer getMonth() {
        return price.getMonth();
    }

    public String getProduct() {
        return price.getProduct();
    }

    public Integer getSeat() {
        return price.getSeat();
    }

    public boolean isOnline() {
        return price.isOnline();
    }

    public BigDecimal getOrigin() {
        return price.getOriginPrice();
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public BigDecimal getActual() {
        return actual;
    }
}
