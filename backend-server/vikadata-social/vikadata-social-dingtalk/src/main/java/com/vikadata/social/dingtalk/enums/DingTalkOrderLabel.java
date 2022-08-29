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
public enum DingTalkOrderLabel {

    /**
     * 普通订单
     */
    ORDINARY(0),

    /**
     * 满赠订单
     */
    FULL_GIFT(1);

    private final Integer code;

    public Integer getCode() {
        return this.code;
    }

    public static DingTalkOrderLabel toEnum(Integer code) {
        for (DingTalkOrderLabel dingTalkOrderLabel : DingTalkOrderLabel.values()) {
            if (dingTalkOrderLabel.code.equals(code)) {
                return dingTalkOrderLabel;
            }
        }
        return null;
    }

    /**
     * 是否是满赠订单
     * @param code 订单label
     * @return boolean
     */
    public static boolean isFullGift(Integer code) {
        return DingTalkOrderLabel.FULL_GIFT.getCode().equals(code);
    }
}
