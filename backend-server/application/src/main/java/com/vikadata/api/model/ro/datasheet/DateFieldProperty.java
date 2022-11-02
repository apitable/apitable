package com.vikadata.api.model.ro.datasheet;

import lombok.Data;

/**
 * <p>
 * 日期字段属性
 * </p>
 *
 * @author Chambers
 * @date 2020/5/7
 */
@Data
public class DateFieldProperty {

    /**
     * 日期格式类型
     */
    private int dateFormat;

    /**
     * 时间格式类型
     */
    private int timeFormat;

    /**
     * 是否包含时间
     */
    private boolean includeTime;

    /**
     * 自动填充
     */
    private boolean autoFill;

}
