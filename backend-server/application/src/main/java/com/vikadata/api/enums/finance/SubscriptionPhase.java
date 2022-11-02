package com.vikadata.api.enums.finance;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SubscriptionPhase {

    TRIAL("trial"),

    FIXEDTERM("fixedterm");

    private final String name;

    public static SubscriptionPhase of(String name) {
        for (SubscriptionPhase value : SubscriptionPhase.values()) {
            if (value.getName().equals(name)) {
                return value;
            }
        }
        return null;
    }
}
