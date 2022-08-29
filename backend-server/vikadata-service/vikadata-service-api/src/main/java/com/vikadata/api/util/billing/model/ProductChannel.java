package com.vikadata.api.util.billing.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 渠道产品分类
 * @author Shawn Deng
 * @date 2022-03-03 21:35:58
 */
@Getter
@RequiredArgsConstructor
public enum ProductChannel {

     PRIVATE("private"),
     VIKA("vika"),
     DINGTALK("dingtalk"),
     LARK("lark"),
     WECOM("wecom");

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
