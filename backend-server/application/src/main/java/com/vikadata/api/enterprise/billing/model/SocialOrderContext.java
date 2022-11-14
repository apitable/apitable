package com.vikadata.api.enterprise.billing.model;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;

import com.vikadata.api.enterprise.billing.enums.OrderChannel;
import com.vikadata.api.enterprise.billing.enums.OrderType;
import com.vikadata.api.enterprise.billing.enums.SubscriptionPhase;
import com.vikadata.api.enterprise.billing.core.Bundle;
import com.vikadata.api.enterprise.billing.util.model.ProductChannel;
import com.vikadata.system.config.billing.Price;
import com.vikadata.system.config.billing.Product;

/**
 * <p>
 * the third party orders
 * </p>
 */
@Data
@Builder(toBuilder = true)
public class SocialOrderContext {

    private ProductChannel productChannel;

    private String socialOrderId;

    /**
     * payment Amount Unit: cents
     */
    private Long amount;

    /**
     * discount amount Unit: cents
     */
    @Default
    private Long discountAmount = 0L;

    /**
     * Total price of the original order Unit: cents
     */
    private Long originalAmount;

    private Price price;

    private Product product;

    private String spaceId;

    private LocalDateTime paidTime;

    private LocalDateTime createdTime;

    private LocalDateTime serviceStartTime;

    private LocalDateTime serviceStopTime;

    /**
     * subscription phase
     */
    @Default
    private SubscriptionPhase phase = SubscriptionPhase.FIXEDTERM;

    private Bundle activatedBundle;

    private OrderChannel orderChannel;

    private OrderType orderType;
}
