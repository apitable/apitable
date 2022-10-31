package com.vikadata.social.dingtalk.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * order lable
 */
@Getter
@AllArgsConstructor
public enum DingTalkOrderLabel {

    /**
     * normal order
     */
    ORDINARY(0),

    /**
     * full gift order
     */
    FULL_GIFT(1);

    private final Integer code;

    public static DingTalkOrderLabel toEnum(Integer code) {
        for (DingTalkOrderLabel dingTalkOrderLabel : DingTalkOrderLabel.values()) {
            if (dingTalkOrderLabel.code.equals(code)) {
                return dingTalkOrderLabel;
            }
        }
        return null;
    }

    /**
     * Is it a full gift order?
     * @param code order label
     * @return boolean
     */
    public static boolean isFullGift(Integer code) {
        return DingTalkOrderLabel.FULL_GIFT.getCode().equals(code);
    }

    public Integer getCode() {
        return this.code;
    }
}
