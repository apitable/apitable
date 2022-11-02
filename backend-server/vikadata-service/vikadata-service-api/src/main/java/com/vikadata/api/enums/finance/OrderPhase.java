package com.vikadata.api.enums.finance;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum OrderPhase {

    TRIAL("trial"),

    FIXEDTERM("fixedterm");

    private final String name;

    public static OrderPhase of(String name) {
        for (OrderPhase value : OrderPhase.values()) {
            if (value.getName().equals(name)) {
                return value;
            }
        }
        return null;
    }
}
