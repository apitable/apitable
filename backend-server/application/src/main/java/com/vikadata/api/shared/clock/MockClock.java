package com.vikadata.api.shared.clock;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.Period;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static java.time.temporal.ChronoUnit.MILLIS;

public class MockClock implements Clock {

    private static final Logger logger = LoggerFactory.getLogger(MockClock.class);

    private OffsetDateTime mockDateTimeUTC;

    private long initialDeltaMillis;

    public MockClock() {
        reset();
    }

    @Override
    public synchronized OffsetDateTime getNow(final ZoneOffset tz) {
        return getUTCNow().withOffsetSameInstant(tz);
    }

    @Override
    public synchronized OffsetDateTime getUTCNow() {
        return truncate(getReferenceDateTimeUTC().plus(System.currentTimeMillis() - initialDeltaMillis, MILLIS));
    }

    @Override
    public LocalDate getUTCToday() {
        return getToday(ZoneOffset.UTC);
    }

    @Override
    public LocalDate getToday(final ZoneOffset timeZone) {
        return getUTCNow().withOffsetSameInstant(timeZone).toLocalDate();
    }

    @Override
    public String toString() {
        return getUTCNow().format(DateTimeFormatter.ofPattern("uuuu-MM-dd'T'HH:mm:ss.SSSXXX"));
    }

    public synchronized void addDays(final int days) {
        adjustTo(Period.ofDays(days));
    }

    public synchronized void addWeeks(final int weeks) {
        adjustTo(Period.ofWeeks(weeks));
    }

    public synchronized void addMonths(final int months) {
        adjustTo(Period.ofMonths(months));
    }

    public synchronized void addYears(final int years) {
        adjustTo(Period.ofYears(years));
    }

    public synchronized void setDay(final LocalDate date) {
        setTime(date.atStartOfDay(ZoneOffset.UTC).toOffsetDateTime());
    }

    public synchronized void setTime(final OffsetDateTime time) {
        final OffsetDateTime prev = getUTCNow();
        reset(time);
        logChange(prev);
    }

    public synchronized void resetDeltaFromReality() {
        final OffsetDateTime prev = getUTCNow();
        reset();
        logChange(prev);
    }

    protected synchronized void reset() {
        reset(realNow());
    }

    private void reset(final OffsetDateTime timeInAnyTimeZone) {
        setReferenceDateTimeUTC(timeInAnyTimeZone.withOffsetSameInstant(ZoneOffset.UTC));
        initialDeltaMillis = System.currentTimeMillis();
    }

    private void adjustTo(final Period period) {
        final OffsetDateTime prev = getUTCNow();
        setReferenceDateTimeUTC(getReferenceDateTimeUTC().plus(period));
        logChange(prev);
    }

    private void logChange(final OffsetDateTime prev) {
        final OffsetDateTime now = getUTCNow();
        logger.info("ADJUSTING CLOCK FROM {} to {}", prev, now);
    }

    private OffsetDateTime truncate(final OffsetDateTime time) {
        return time.truncatedTo(MILLIS);
    }

    private OffsetDateTime realNow() {
        return OffsetDateTime.now(ZoneOffset.UTC);
    }

    protected void setReferenceDateTimeUTC(final OffsetDateTime mockDateTimeUTC) {
        this.mockDateTimeUTC = mockDateTimeUTC;
    }

    protected OffsetDateTime getReferenceDateTimeUTC() {
        return this.mockDateTimeUTC;
    }
}
