package com.vikadata.api.enums.finance;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum OrderStatus {

    UNPAID("unpaid"),

    CANCELED("canceled"),

    FINISHED("finished");

    private final String name;

    public static OrderStatus of(String name) {
        for (OrderStatus value : OrderStatus.values()) {
            if (value.getName().equals(name)) {
                return value;
            }
        }
        return null;
    }
}
