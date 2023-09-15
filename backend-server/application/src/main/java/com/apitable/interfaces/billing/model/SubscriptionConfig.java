package com.apitable.interfaces.billing.model;

/**
 * Subscription config.
 */
public class SubscriptionConfig {

    private boolean allowCreditOverLimit;

    public static SubscriptionConfig create() {
        return new SubscriptionConfig();
    }

    public SubscriptionConfig setAllowCreditOverLimit(boolean allowCreditOverLimit) {
        this.allowCreditOverLimit = allowCreditOverLimit;
        return this;
    }

    public boolean isAllowCreditOverLimit() {
        return allowCreditOverLimit;
    }
}
