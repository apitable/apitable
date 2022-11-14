package com.vikadata.api.enterprise.billing.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum OrderChannel {

    VIKA("vika"),

    OFFLINE("offline"),

    LARK("lark"),

    DINGTALK("dingtalk"),

    WECOM("wecom");

    private final String name;

    public static OrderChannel of(String name) {
        for (OrderChannel value : OrderChannel.values()) {
            if (value.getName().equals(name)) {
                return value;
            }
        }
        return null;
    }
}
