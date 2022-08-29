package com.vikadata.api.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

/**
 * <p>
 * 补充时间工具类
 * </p>
 *
 * @author Chambers
 * @date 2019/12/27
 */
public class DateTool {

    /**
     * 获取今天剩余时间（单位：秒）
     */
    public static long todayTimeLeft() {
        LocalDateTime midnight = LocalDateTime.now().plusDays(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        return ChronoUnit.SECONDS.between(LocalDateTime.now(), midnight);
    }

    /**
     * 获取当月开始时间
     */
    public static LocalDateTime getStartTimeOfMonth() {
        LocalDate date = LocalDate.now();
        return LocalDateTime.of(date.getYear(), date.getMonth(), 1, 0, 0);
    }

    /**
     * 根据传入的格式，格式化时间
     *
     * @param localDateTime LocalDateTime
     * @param format        格式
     * @return 格式化后的字符串
     */
    public static String formatFullTime(LocalDateTime localDateTime, String format) {
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(format);
        return localDateTime.format(dateTimeFormatter);
    }
}
