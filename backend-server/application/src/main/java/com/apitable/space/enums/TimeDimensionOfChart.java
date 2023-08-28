package com.apitable.space.enums;

/**
 * time dimension of chart.
 *
 * @author Shawn Deng
 */
public enum TimeDimensionOfChart {

    TODAY, WEEKDAY, MONTH, YEAR, ALL;

    /**
     * transform string to enum.
     *
     * @param value string value
     * @return enum
     */
    public static TimeDimensionOfChart of(String value) {
        for (TimeDimensionOfChart timeDimensionOfChart : TimeDimensionOfChart.values()) {
            if (timeDimensionOfChart.name().equalsIgnoreCase(value)) {
                return timeDimensionOfChart;
            }
        }
        return null;
    }
}
