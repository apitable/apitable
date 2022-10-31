package com.vikadata.social.feishu.enums;

import java.util.Objects;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Feishu Order Type
 * @date 202/12/28 2:08 PM
 */
@Getter
@AllArgsConstructor
public enum LarkOrderBuyType {
    BUY("buy"),

    UPGRADE("upgrade"),

    RENEW("renew");

    private final String type;

    public String getType() {
        return this.type;
    }

    public static LarkOrderBuyType of(String value) {
        for (LarkOrderBuyType socialAppType : LarkOrderBuyType.values()) {
            if (Objects.equals(socialAppType.type, value)) {
                return socialAppType;
            }
        }
        return BUY;
    }
}
