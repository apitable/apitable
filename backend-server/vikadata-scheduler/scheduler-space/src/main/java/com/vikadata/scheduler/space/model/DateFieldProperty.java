package com.vikadata.scheduler.space.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 时间字段属性
 * </p>
 *
 * @author Chambers
 * @date 2020/5/7
 */
@Data
public class DateFieldProperty {

    private Old old;

    private New aNew;

    @Setter
    @Getter
    public static class Old {

        private String dateFormat;

        private String timeFormat;

        private boolean autoFill;
    }

    @Setter
    @Getter
    public static class New {

        private int dateFormat;

        private int timeFormat;

        private boolean includeTime;

        private boolean autoFill;
    }
}
