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

import static java.time.temporal.ChronoUnit.MILLIS;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.Period;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * mock clock that can be used to simulate time passing.
 */
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
        return truncate(
            getReferenceDateTimeUTC().plus(System.currentTimeMillis() - initialDeltaMillis,
                MILLIS));
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

    /**
     * set the time to the given time. This will be the new reference time for the clock.
     *
     * @param time the new time
     */
    public synchronized void setTime(final OffsetDateTime time) {
        final OffsetDateTime prev = getUTCNow();
        reset(time);
        logChange(prev);
    }

    /**
     * reset the clock to the current time.
     */
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
