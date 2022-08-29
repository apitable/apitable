package com.vikadata.api.enums.datasheet;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 日期字段 时间格式类型
 * </p>
 *
 * @author Chambers
 * @date 2020/6/11
 */
@Getter
@AllArgsConstructor
public enum TimeFormat {

    /**
     * 时分类型
     */
    TIME(0, "HH:mm");

    private int type;

    private String pattern;

    public static String getPattern(int type) {
        for (TimeFormat format : TimeFormat.values()) {
            if (format.getType() == type) {
                return format.getPattern();
            }
        }
        return TIME.getPattern();
    }
}
