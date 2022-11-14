package com.vikadata.api.enterprise.billing.core;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

import com.vikadata.api.enterprise.billing.enums.SubscriptionPhase;
import com.vikadata.api.enterprise.billing.enums.SubscriptionState;
import com.vikadata.api.enterprise.billing.util.model.ProductCategory;

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
