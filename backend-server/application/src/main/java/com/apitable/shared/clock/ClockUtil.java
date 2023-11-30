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

package com.apitable.shared.clock;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

/**
 * clock instance util.
 */
public class ClockUtil {

    /**
     * Create a DateTime object using the specified reference time and timezone.
     *
     * @param localDate     LocalDate to convert
     * @param referenceTime Reference local time
     * @param timeZone      Target timezone
     * @return DateTime representing the input localDate at the specified reference time, in UTC
     */
    public static OffsetDateTime toUTCDateTime(final LocalDate localDate,
                                               final LocalTime referenceTime,
                                               final ZoneOffset timeZone) {
        OffsetDateTime targetDateTime = OffsetDateTime.of(localDate, referenceTime, timeZone);
        return toUTCDateTime(targetDateTime);
    }

    /**
     * Create a DateTime object forcing the timezone to be UTC.
     *
     * @param dateTime DateTime to convert
     * @return DateTime representing the input dateTime in UTC
     */
    public static OffsetDateTime toUTCDateTime(final OffsetDateTime dateTime) {
        return toDateTime(dateTime, ZoneOffset.UTC);
    }

    /**
     * Create a LocalDate object using the specified timezone.
     *
     * @param dateTime DateTime to convert
     * @param timeZone Target timezone
     * @return LocalDate representing the input dateTime in the specified timezone
     */
    public static LocalDate toLocalDate(final OffsetDateTime dateTime, final ZoneOffset timeZone) {
        return dateTime.withOffsetSameInstant(timeZone).toLocalDate();
    }

    /**
     * Create a DateTime object using the specified timezone.
     *
     * @param dateTime DateTime to convert
     * @param timeZone Target timezone
     * @return DateTime representing the input dateTime in the specified timezone
     */
    public static OffsetDateTime toDateTime(final OffsetDateTime dateTime,
                                            final ZoneOffset timeZone) {
        return dateTime.withOffsetSameInstant(timeZone);
    }

    public static LocalDateTime secondToLocalDateTime(final long timestamp,
                                                      final ZoneOffset timeZone) {
        return OffsetDateTime.ofInstant(Instant.ofEpochSecond(timestamp), timeZone)
            .toLocalDateTime();
    }

    public static LocalDateTime milliToLocalDateTime(final long timestamp,
                                                     final ZoneOffset timeZone) {
        return OffsetDateTime.ofInstant(Instant.ofEpochMilli(timestamp), timeZone)
            .toLocalDateTime();
    }

    public static LocalDate milliToLocalDate(final long timestamp, final ZoneOffset timeZone) {
        return OffsetDateTime.ofInstant(Instant.ofEpochMilli(timestamp), timeZone).toLocalDate();
    }

    public static String formatTimeZone(final ZoneOffset timeZone) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("xxx");
        return formatter.format(timeZone);
    }
}
