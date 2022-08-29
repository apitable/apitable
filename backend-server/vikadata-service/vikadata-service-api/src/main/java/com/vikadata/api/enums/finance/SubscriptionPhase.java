package com.vikadata.api.enums.finance;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/** 
* <p> 
* 订阅阶段
* </p> 
* @author zoe zheng 
* @date 2022/5/26 14:43
*/
@Getter
@RequiredArgsConstructor
public enum SubscriptionPhase {
    /**
     * 试用
     */
    TRIAL("trial"),
    /**
     * 固定期限
     */
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
