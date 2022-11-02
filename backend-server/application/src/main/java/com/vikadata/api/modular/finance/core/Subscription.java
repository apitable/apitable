package com.vikadata.api.modular.finance.core;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

import com.vikadata.api.enums.finance.SubscriptionPhase;
import com.vikadata.api.enums.finance.SubscriptionState;
import com.vikadata.api.util.billing.model.ProductCategory;

/**
 * Subscription Items in Subscription Bundles
 */
@Data
@Builder
public class Subscription {

    private String spaceId;

    /**
     * subscription bundle ID
     */
    private String bundleId;

    private String subscriptionId;

    private String productName;

    private ProductCategory productCategory;

    /**
     * product plan
     */
    private String planId;

    /**
     * subscription state
     */
    private SubscriptionState state;

    private LocalDateTime startDate;

    private LocalDateTime expireDate;

    /**
     * subscription phase
     */
    private SubscriptionPhase phase;
}
