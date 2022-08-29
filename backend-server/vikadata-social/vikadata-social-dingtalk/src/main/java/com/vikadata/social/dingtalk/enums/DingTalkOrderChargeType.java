package com.vikadata.social.dingtalk.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p> 
 * 订单收费类型（仅针对试用规格）
 * </p> 
 * @author zoe zheng 
 * @date 2021/10/28 14:19
 */
@Getter
@AllArgsConstructor
public enum DingTalkOrderChargeType {

    /**
     * 免费开通
     */
    FREE("FREE"),

    /**
     * 试用开通
     */
    TRYOUT("TRYOUT");

    private final String value;

    public String getValue() {
        return this.value;
    }

}
