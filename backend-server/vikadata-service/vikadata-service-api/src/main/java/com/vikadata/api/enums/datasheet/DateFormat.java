package com.vikadata.api.enums.datasheet;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 日期字段 日期格式类型
 * </p>
 *
 * @author Chambers
 * @date 2020/6/11
 */
@Getter
@AllArgsConstructor
public enum DateFormat {

    /**
     * 分隔
     */
    SEPARATE(0, "yyyy/MM/dd"),

    /**
     * 常规
     */
    NORM(1, "yyyy-MM-dd"),

    /**
     * 逆序
     */
    INVERSE(2, "dd/MM/yyyy"),

    /**
     * 常规月份日期
     */
    NORM_MD(3, "MM-dd");

    private final int type;

    private final String pattern;

    public static String getPattern(int type) {
        for (DateFormat format : DateFormat.values()) {
            if (format.getType() == type) {
                return format.getPattern();
            }
        }
        return SEPARATE.getPattern();
    }
}
