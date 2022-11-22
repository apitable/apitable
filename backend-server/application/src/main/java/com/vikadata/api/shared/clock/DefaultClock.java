package com.vikadata.api.shared.clock;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import static java.time.temporal.ChronoUnit.MILLIS;

public class DefaultClock implements Clock {
    @Override
    public OffsetDateTime getNow(final ZoneOffset tz) {
        final OffsetDateTime result = OffsetDateTime.now(tz);
        return truncateMs(result);
    }

    @Override
    public OffsetDateTime getUTCNow() {
        return getNow(ZoneOffset.UTC);
    }

    @Override
    public LocalDate getUTCToday() {
        return getToday(ZoneOffset.UTC);
    }

    @Override
    public LocalDate getToday(final ZoneOffset timeZone) {
        return getUTCNow().withOffsetSameInstant(timeZone).toLocalDate();
    }

    public static OffsetDateTime toUTCDateTime(final OffsetDateTime input) {
        if (input == null) {
            return null;
        }
        final OffsetDateTime result = input.with(ZoneOffset.UTC);
        return truncateMs(result);
    }

    public static OffsetDateTime truncateMs(final OffsetDateTime input) {
        return input.truncatedTo(MILLIS);
    }
}
