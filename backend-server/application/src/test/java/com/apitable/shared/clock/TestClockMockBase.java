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

import java.time.LocalDate;
import java.time.OffsetDateTime;

import static java.time.ZoneOffset.UTC;
import static java.util.concurrent.TimeUnit.MILLISECONDS;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.byLessThan;
import static org.awaitility.Awaitility.await;

public abstract class TestClockMockBase {

    protected void testBasicClockOperations(final MockClock clock) {
        final OffsetDateTime startingTime = OffsetDateTime.now(UTC);
        // Lame, but required due to the truncation magic
        await().atMost(1500, MILLISECONDS).until(() -> clock.getUTCNow().isAfter(startingTime));

        clock.setTime(OffsetDateTime.of(2012, 5, 1, 1, 2, 3, 0, UTC));
        assertThat(LocalDate.of(2012, 5, 1)).isEqualTo(clock.getUTCToday());
        final OffsetDateTime utcNowAfterSetTime = clock.getUTCNow();
        assertThat(utcNowAfterSetTime.getYear()).isEqualTo(2012);
        assertThat(utcNowAfterSetTime.getMonthValue()).isEqualTo(5);
        assertThat(utcNowAfterSetTime.getDayOfMonth()).isEqualTo(1);
        assertThat(1).isEqualTo(utcNowAfterSetTime.getHour());
        assertThat(2).isEqualTo(utcNowAfterSetTime.getMinute());
        assertThat(3).isCloseTo(utcNowAfterSetTime.getSecond(), byLessThan(2));

        clock.addDays(1);
        assertThat(LocalDate.of(2012, 5, 2)).isEqualTo(clock.getUTCToday());

        clock.addMonths(1);
        assertThat(LocalDate.of(2012, 6, 2)).isEqualTo(clock.getUTCToday());

        clock.addYears(1);
        assertThat(LocalDate.of(2013, 6, 2)).isEqualTo(clock.getUTCToday());

        clock.setDay(LocalDate.of(2045, 12, 12));
        assertThat(LocalDate.of(2045, 12, 12)).isEqualTo(clock.getUTCToday());

        clock.addWeeks(1);
        assertThat(LocalDate.of(2045, 12, 19)).isEqualTo(clock.getUTCToday());

        clock.resetDeltaFromReality();
        assertThat(clock.getUTCNow().isAfter(startingTime)).isTrue();
        assertThat(clock.getUTCNow().isBefore(startingTime.plusMinutes(1))).isTrue();
    }
}
