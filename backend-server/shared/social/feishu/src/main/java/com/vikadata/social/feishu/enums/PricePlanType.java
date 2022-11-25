package com.vikadata.social.feishu.enums;

import java.util.Objects;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Feishu user purchase plan types
 */
@Getter
@AllArgsConstructor
public enum PricePlanType {

    TRIAL("trial"),

    /**
     * one-time payment
     */
    PERMANENT("permanent"),

    /**
     * Enterprise annual payment
     */
    PER_YEAR("per_year"),

    /**
     * Enterprise monthly payment
     */
    PER_MONTH("per_month"),

    /**
     * Pay per person per year
     */
    PER_SEAT_PER_YEAR("per_seat_per_year"),

    /**
     * Pay per person per month
     */
    PER_SEAT_PER_MONTH("per_seat_per_month"),

    /**
     * pay-per-view
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
