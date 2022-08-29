package com.vikadata.social.feishu.enums;

import java.util.Objects;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 飞书订单类型
 * </p>
 * @author zoe zheng
 * @date 2021/12/28 2:08 PM
 */
@Getter
@AllArgsConstructor
public enum LarkOrderBuyType {
    /**
     * 普通购买
     */
    BUY("buy"),

    /**
     * 升级购买
     */
    UPGRADE("upgrade"),

    /**
     * 续费购买
     */
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
