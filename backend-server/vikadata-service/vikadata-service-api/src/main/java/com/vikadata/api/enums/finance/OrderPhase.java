package com.vikadata.api.enums.finance;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * <p>
 * 订单阶段
 * </p>
 * @author zoe zheng
 * @date 2022/2/25 16:09
 * @Deprecated 迁移到订阅表
 */
@Getter
@RequiredArgsConstructor
public enum OrderPhase {
    /**
     * 试用
     */
    TRIAL("trial"),
    /**
     * 固定期限
     */
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
