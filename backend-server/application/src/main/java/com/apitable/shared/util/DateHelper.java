/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.shared.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;

/**
 * <p>
 * Date util.
 * </p>
 *
 * @author Chambers
 */
public class DateHelper {

    /**
     * simple date formatter: yyyy-MM-dd.
     */
    public static final DateTimeFormatter SIMPLE_DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /**
     * simple date formatter: yyyy-MM.
     */
    public static final DateTimeFormatter SIMPLE_MONTH = DateTimeFormatter.ofPattern("yyyy-MM");

    /**
     * get the time remaining for today(unit：second).
     */
    public static long todayTimeLeft() {
        LocalDateTime midnight =
            LocalDateTime.now().plusDays(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        return ChronoUnit.SECONDS.between(LocalDateTime.now(), midnight);
    }

    /**
     * Safely sets the specified day of the month for the given LocalDate object.
     * It checks the last day of the month for the given date and sets the day of the month
     * based on the maximum valid day of the month.
     *
     * @param current       The current LocalDate object to set the day of the month.
     * @param dayOfMonth    The desired day of the month to set.
     * @return              A new LocalDate object with the safely set day of the month.
     */
    public static LocalDate safeSetDayOfMonth(LocalDate current, int dayOfMonth) {
        LocalDate lastDayOfMonth = current.with(TemporalAdjusters.lastDayOfMonth());
        return current.withDayOfMonth(Math.min(dayOfMonth, lastDayOfMonth.getDayOfMonth()));
    }

    /**
     * format the time according to the incoming format.
     *
     * @param date   date
     * @param format formatter
     * @return formatted string
     */
    public static String formatFullTime(LocalDate date, String format) {
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(format);
        return date.format(dateTimeFormatter);
    }
}
