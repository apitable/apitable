package com.vikadata.api.util.billing.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * billing function type
 * @author Shawn Deng
 */
@Getter
@RequiredArgsConstructor
public enum BillingFunctionType {

    SUBSCRIBE("subscribe"),

    CONSUME("consume"),

    SOLID("solid");

    private final String type;

    public static BillingFunctionType of(String type) {
        for (BillingFunctionType e : BillingFunctionType.values()) {
            if (e.getType().equals(type)) {
                return e;
            }
        }
        return null;
    }

    public boolean isConsume() {
        return "consume".equals(type);
    }

    public boolean isSubscribe() {
        return "subscribe".equals(type);
    }

    public boolean isSolid() {
        return "solid".equals(type);
    }
}
