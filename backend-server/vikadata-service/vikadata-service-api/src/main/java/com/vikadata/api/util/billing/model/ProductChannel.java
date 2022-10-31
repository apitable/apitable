package com.vikadata.api.util.billing.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * product channel
 * @author Shawn Deng
 */
@Getter
@RequiredArgsConstructor
public enum ProductChannel {

     PRIVATE("private"),
     VIKA("vika"),
     DINGTALK("dingtalk"),
     LARK("lark"),
     WECOM("wecom"),
     ALIYUN("aliyun");

    private final String name;

    public static ProductChannel of(String name) {
        for (ProductChannel value : ProductChannel.values()) {
            if (value.getName().equals(name)) {
                return value;
            }
        }
        return null;
    }
}
