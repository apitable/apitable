package com.vikadata.social.dingtalk.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p> 
 * 订单标记
 * </p> 
 * @author zoe zheng 
 * @date 2021/10/28 14:19
 */
@Getter
@AllArgsConstructor
public enum DingTalkOrderType {
    /**
     * 新购
     */
    BUY("BUY"),

    /**
     * 续费
     */
    RENEW("RENEW"),
    /**
     * 升级
     */
    UPGRADE("UPGRADE"),
    /**
     * 续费升配
     */
    RENEW_UPGRADE("RENEW_UPGRADE"),
    /**
     * 续费降配
     */
    RENEW_DEGRADE("RENEW_DEGRADE");

    private final String value;

    public String getValue(String value) {
        return this.value;
    }

}
