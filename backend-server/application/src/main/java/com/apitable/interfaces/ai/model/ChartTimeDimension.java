package com.apitable.interfaces.ai.model;

/**
 * chart period dimension.
 *
 * @author Shawn Deng
 */
public enum ChartTimeDimension {

    TODAY,
    WEEKDAY,
    MONTH,
    YEAR;

    /**
     * transform string to enum.
     *
     * @param value string value
     * @return enum
     */
    public static ChartTimeDimension of(String value) {
        for (ChartTimeDimension timeDimension : ChartTimeDimension.values()) {
            if (timeDimension.name().equalsIgnoreCase(value)) {
                return timeDimension;
            }
        }
        return null;
    }
}
