package com.vikadata.core.util;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoField;
import java.time.temporal.TemporalAccessor;
import java.util.Objects;

/**
 * <p>
 * date time tool
 * </p>
 */
public class DateTimeUtil {

    /**
     * HH:mmZ
     */
    public static final DateTimeFormatter HOUR_MINUTE_ZONE = DateTimeFormatter.ofPattern("HH:mmZ");

    /**
     * HH:mm:ssZ
     */
    public static final DateTimeFormatter HOUR_MINUTE_SECOND_ZONE = DateTimeFormatter.ofPattern("HH:mm:ssZ");

    /**
     * gets the current time's {@link LocalTime}
     *
     * @param zoneOffset time zone offset
     * @return the current time
     */
    public static LocalTime localTimeNow(int zoneOffset) {
        return LocalTime.now(ZoneOffset.ofHours(zoneOffset));
    }

    /**
     * string to {@link LocalTime}
     *
     * @param source    the datetime string
     * @param formatter format of the datetime string
     * @return {@link LocalTime}
     */
    public static LocalTime localTimeFromSource(String source, DateTimeFormatter formatter) {
        return LocalTime.parse(source, formatter);
    }

    /**
     * gets the current time's {@link LocalDateTime}
     *
     * @param zoneOffset time zone offset
     * @return the current time
     */
    public static LocalDateTime localDateTimeNow(int zoneOffset) {
        return LocalDateTime.now(ZoneOffset.ofHours(zoneOffset));
    }

    /**
     * Gets the time's {@link LocalDateTime} of the current offset
     *
     * @param zoneOffset    time zone offset
     * @param plusDays      offset days
     * @param plusHours     offset hours
     * @param plusMinutes   offset minutes
     * @param plusSeconds   offset seconds
     * @return the offset datetime
     */
    public static LocalDateTime localDateTimeFromNow(int zoneOffset, int plusDays, int plusHours, int plusMinutes, int plusSeconds) {
        LocalDateTime now = localDateTimeNow(zoneOffset);
        if (plusDays != 0) {
            now = now.plusDays(plusDays);
        }
        if (plusHours != 0) {
            now = now.plusHours(plusHours);
        }
        if (plusMinutes != 0) {
            now = now.plusMinutes(plusMinutes);
        }
        if (plusSeconds != 0) {
            now = now.plusSeconds(plusSeconds);
        }

        return now;
    }

    /**
     * the unix timestamp to {@link LocalDateTime}
     *
     * @param epochSeconds  Unix timestamp. unit：second
     * @param zoneOffset    the offset time zone
     * @return the converted time
     */
    public static LocalDateTime localDateTimeFromSeconds(Long epochSeconds, int zoneOffset) {
        return localDateTimeFromSeconds(epochSeconds, zoneOffset, false);
    }

    /**
     * the unix timestamp to  {@link LocalDateTime}
     *
     * @param epochSeconds  Unix timestamp. unit：second
     * @param zoneOffset    the offset time zone
     * @param allowZero     if false, when epochSeconds is 0, return null.
     * @return the converted time
     */
    public static LocalDateTime localDateTimeFromSeconds(Long epochSeconds, int zoneOffset, boolean allowZero) {
        if (Objects.isNull(epochSeconds) || epochSeconds == 0L && !allowZero) {
            return null;
        }

        return LocalDateTime.ofEpochSecond(epochSeconds, 0, ZoneOffset.ofHours(zoneOffset));
    }

    /**
     * calculate the difference between two natural times
     *
     * @param startTime starting time
     * @param endTime   ending time
     * @param field     the unit for calculating the difference
     * @return long     the difference in natural time
     */
    public static long between(TemporalAccessor startTime, TemporalAccessor endTime, ChronoField field) {
        return endTime.getLong(field) - startTime.getLong(field);
    }

}
