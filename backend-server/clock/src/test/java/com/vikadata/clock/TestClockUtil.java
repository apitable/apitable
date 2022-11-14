package com.vikadata.clock;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.junit.jupiter.api.Test;

import static java.time.ZoneOffset.UTC;
import static org.assertj.core.api.Assertions.assertThat;

public class TestClockUtil {

    @Test
    public void testWithInputInThePast() {
        // should offset 1 hour
        final ZoneOffset inputTimeZone = ZoneOffset.ofHours(1);
        // target time date
        final LocalDate inputDateInTargetTimeZone = LocalDate.of(2014, 10, 23);
        // input time
        final LocalTime inputTimeInUTC = LocalTime.of(10, 23, 5);

        final OffsetDateTime result = ClockUtil.toUTCDateTime(inputDateInTargetTimeZone, inputTimeInUTC, inputTimeZone);
        assertThat(result.compareTo(OffsetDateTime.of(2014, 10, 23, 9, 23, 5, 0, UTC)))
                .isEqualTo(0);

        // ClockUtil should have returned a DateTime which when converted back into a LocalDate in the inputTimeZone matches the input
        assertThat(result.with(inputTimeZone).toLocalDate().compareTo(inputDateInTargetTimeZone))
                .isEqualTo(0);
    }

    @Test
    public void testWithInputInTheFuture() {
        final ZoneOffset inputTimeZone = ZoneOffset.ofHours(-1);
        final LocalDate inputDateInTargetTimeZone = LocalDate.of(2014, 10, 23);
        final LocalTime inputTimeInUTC = LocalTime.of(10, 23, 5);

        final OffsetDateTime result = ClockUtil.toUTCDateTime(inputDateInTargetTimeZone, inputTimeInUTC, inputTimeZone);
        assertThat(result.compareTo(OffsetDateTime.of(2014, 10, 23, 11, 23, 5, 0, UTC)))
                .isEqualTo(0);

        // ClockUtil should have returned a DateTime which when converted back into a LocalDate in the inputTimeZone matches the input
        assertThat(result.with(inputTimeZone).toLocalDate().compareTo(inputDateInTargetTimeZone))
                .isEqualTo(0);
    }

    @Test
    public void testFormatTimeZone() {
        final String utcFormat = ClockUtil.formatTimeZone(ZoneOffset.UTC);
        assertThat(utcFormat).isEqualTo("+00:00");

        final String maxFormat = ClockUtil.formatTimeZone(ZoneOffset.MAX);
        assertThat(maxFormat).isEqualTo("+18:00");

        final String minFormat = ClockUtil.formatTimeZone(ZoneOffset.MIN);
        assertThat(minFormat).isEqualTo("-18:00");

        final String randomFormat = ClockUtil.formatTimeZone(ZoneOffset.ofHours(2));
        assertThat(randomFormat).isEqualTo("+02:00");
    }
}
