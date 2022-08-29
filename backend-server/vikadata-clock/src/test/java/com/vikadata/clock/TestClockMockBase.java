
package com.vikadata.clock;

import java.time.LocalDate;
import java.time.OffsetDateTime;

import static java.time.ZoneOffset.UTC;
import static java.util.concurrent.TimeUnit.MILLISECONDS;
import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;

public abstract class TestClockMockBase {

    protected void testBasicClockOperations(final MockClock clock) {
        final OffsetDateTime startingTime = OffsetDateTime.now(UTC);
        // Lame, but required due to the truncation magic
        await().atMost(1500, MILLISECONDS).until(() -> clock.getUTCNow().isAfter(startingTime));

        clock.setTime(OffsetDateTime.of(2012, 5, 1, 1, 2, 3, 0, UTC));
        assertThat(LocalDate.of(2012, 5, 1)).isEqualTo(clock.getUTCToday());
        final OffsetDateTime utcNowAfterSetTime = clock.getUTCNow();
        assertThat(1).isEqualTo(utcNowAfterSetTime.getHour());
        assertThat(2).isEqualTo(utcNowAfterSetTime.getMinute());
        assertThat(3).isEqualTo(utcNowAfterSetTime.getSecond());

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
