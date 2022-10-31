package com.vikadata.core.util;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoField;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

/**
 * <p>
 *  date time util's test
 * </p>
 */
class DateTimeUtilTests {

    @Test
    void localTimeNowTest() {
        LocalTime localTime = DateTimeUtil.localTimeNow(8);
        Assertions.assertNotNull(localTime);
    }

    @Test
    void localTimeFromSourceTest() {
        LocalTime comparedTime = LocalTime.of(9, 0, 0);
        LocalTime localTime = DateTimeUtil.localTimeFromSource("09:00+0800", DateTimeUtil.HOUR_MINUTE_ZONE);
        Assertions.assertEquals(comparedTime, localTime);

        comparedTime = LocalTime.of(10, 0, 0);
        localTime = DateTimeUtil.localTimeFromSource("10:00:00+0800", DateTimeUtil.HOUR_MINUTE_SECOND_ZONE);
        Assertions.assertEquals(comparedTime, localTime);
    }

    @Test
    void localDateTimeNowTest() {
        LocalDateTime localDateTime = DateTimeUtil.localDateTimeNow(8);
        Assertions.assertNotNull(localDateTime);
    }

    @Test
    void localDateTimeFromNowTest() {
        LocalDateTime localDateTime = DateTimeUtil.localDateTimeFromNow(8, 1, 2, 3, 4);
        Assertions.assertNotNull(localDateTime);
    }

    @Test
    void localDateTimeFromSecondsTest() {
        long epochSeconds = 1658131661L;
        LocalDateTime comparedDateTime = LocalDateTime.of(2022, 7, 18, 16, 7, 41);
        LocalDateTime localDateTime = DateTimeUtil.localDateTimeFromSeconds(epochSeconds, 8);
        Assertions.assertEquals(comparedDateTime, localDateTime);

        localDateTime = DateTimeUtil.localDateTimeFromSeconds(0L, 8);
        Assertions.assertNull(localDateTime);
    }

    @Test
    void localDateTimeFromSecondsFullTest() {
        long epochSeconds = 1658131661L;
        LocalDateTime comparedDateTime = LocalDateTime.of(2022, 7, 18, 16, 7, 41);
        LocalDateTime localDateTime = DateTimeUtil.localDateTimeFromSeconds(epochSeconds, 8);
        Assertions.assertEquals(comparedDateTime, localDateTime);

        LocalDateTime zeroDateTime = LocalDateTime.of(1970, 1, 1, 8, 0, 0);
        localDateTime = DateTimeUtil.localDateTimeFromSeconds(0L, 8, true);
        Assertions.assertEquals(zeroDateTime, localDateTime);

        localDateTime = DateTimeUtil.localDateTimeFromSeconds(0L, 8, false);
        Assertions.assertNull(localDateTime);
    }

    @Test
    void betweenTest() {
        LocalDateTime startDateTime = LocalDateTime.of(2022, 7, 29 , 18, 34, 20);
        LocalDateTime endDateTime1 = LocalDateTime.of(2022, 7, 29 , 18, 34, 21);
        LocalDateTime endDateTime2 = LocalDateTime.of(2022, 7, 30 , 0, 0, 0);
        LocalDateTime endDateTime3 = LocalDateTime.of(2022, 7, 30 , 18, 34, 19);
        LocalDateTime endDateTime4 = LocalDateTime.of(2022, 7, 30 , 18, 34, 20);
        LocalDateTime endDateTime5 = LocalDateTime.of(2022, 7, 30 , 18, 34, 21);
        LocalDateTime endDateTime6 = LocalDateTime.of(2022, 7, 31 , 0, 0, 0);
        LocalDateTime endDateTime7 = LocalDateTime.of(2022, 8, 1 , 0, 0, 0);
        long betweenDays = DateTimeUtil.between(startDateTime, startDateTime, ChronoField.EPOCH_DAY);
        Assertions.assertEquals(0, betweenDays);

        betweenDays = DateTimeUtil.between(startDateTime, endDateTime1, ChronoField.EPOCH_DAY);
        Assertions.assertEquals(0, betweenDays);

        betweenDays = DateTimeUtil.between(startDateTime, endDateTime2, ChronoField.EPOCH_DAY);
        Assertions.assertEquals(1, betweenDays);

        betweenDays = DateTimeUtil.between(startDateTime, endDateTime3, ChronoField.EPOCH_DAY);
        Assertions.assertEquals(1, betweenDays);

        betweenDays = DateTimeUtil.between(startDateTime, endDateTime4, ChronoField.EPOCH_DAY);
        Assertions.assertEquals(1, betweenDays);

        betweenDays = DateTimeUtil.between(startDateTime, endDateTime5, ChronoField.EPOCH_DAY);
        Assertions.assertEquals(1, betweenDays);

        betweenDays = DateTimeUtil.between(startDateTime, endDateTime6, ChronoField.EPOCH_DAY);
        Assertions.assertEquals(2, betweenDays);

        betweenDays = DateTimeUtil.between(startDateTime, endDateTime7, ChronoField.EPOCH_DAY);
        Assertions.assertEquals(3, betweenDays);
    }

}
