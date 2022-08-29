package com.vikadata.api.util.billing.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 功能点类型
 * @author Shawn Deng
 * @date 2021-11-02 16:48:52
 */
@Getter
@RequiredArgsConstructor
public enum BillingFunctionType {

    /**
     * 订阅型
     */
    SUBSCRIBE("subscribe"),

    /**
     * 消耗型
     */
    CONSUME("consume"),

    /**
     * 固定型
     */
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
        return type.equals("consume");
    }

    public boolean isSubscribe() {
        return type.equals("subscribe");
    }

    public boolean isSolid() {
        return type.equals("solid");
    }
}
