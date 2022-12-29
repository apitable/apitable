package com.vikadata.api.shared.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

/**
 * <p>
 * Date util
 * </p>
 *
 * @author Chambers
 */
public class DateHelper {

    /**
     * get the time remaining for today（unit：second）
     */
    public static long todayTimeLeft() {
        LocalDateTime midnight = LocalDateTime.now().plusDays(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        return ChronoUnit.SECONDS.between(LocalDateTime.now(), midnight);
    }

    public static LocalDateTime getStartTimeOfMonth() {
        LocalDate date = LocalDate.now();
        return LocalDateTime.of(date.getYear(), date.getMonth(), 1, 0, 0);
    }

    /**
     * format the time according to the incoming format
     *
     * @param localDateTime LocalDateTime
     * @param format        formatter
     * @return formatted string
     */
    public static String formatFullTime(LocalDateTime localDateTime, String format) {
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(format);
        return localDateTime.format(dateTimeFormatter);
    }
}
