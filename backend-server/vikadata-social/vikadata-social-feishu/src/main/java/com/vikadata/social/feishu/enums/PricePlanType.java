package com.vikadata.social.feishu.enums;

import java.util.Objects;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 飞书用户购买方案类型
 * </p>
 * @author zoe zheng
 * @date 2021/12/28 2:08 PM
 */
@Getter
@AllArgsConstructor
public enum PricePlanType {
    /**
     * 试用
     */
    TRIAL("trial"),

    /**
     * 一次性付费
     */
    PERMANENT("permanent"),

    /**
     * 企业年付费
     */
    PER_YEAR("per_year"),

    /**
     * 企业月付费
     */
    PER_MONTH("per_month"),

    /**
     * 按人按年付费
     */
    PER_SEAT_PER_YEAR("per_seat_per_year"),

    /**
     * 按人按月付费
     */
    PER_SEAT_PER_MONTH("per_seat_per_month"),

    /**
     * 按次付费
     */
    PERMANENT_COUNT("permanent_count");

    private final String type;

    public String getType() {
        return this.type;
    }

    public static PricePlanType of(String value) {
        for (PricePlanType socialAppType : PricePlanType.values()) {
            if (Objects.equals(socialAppType.type, value)) {
                return socialAppType;
            }
        }
        return PER_YEAR;
    }
}
