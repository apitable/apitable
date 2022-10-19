package com.vikadata.api.context;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatNoException;

public class ClockManagerTest extends AbstractIntegrationTest {

    @Test
    public void testGetMockClock() {
        assertThatNoException().isThrownBy(() -> ClockManager.me().getMockClock());
    }

    @Test
    public void testGetUTCNow() {
        final OffsetDateTime initialCreateDate = OffsetDateTime.of(2022, 2, 1, 19, 10, 30, 0, ZoneOffset.UTC);
        getClock().setTime(initialCreateDate);

        OffsetDateTime utcNow = ClockManager.me().getUTCNow();

        assertThat(utcNow).isAfterOrEqualTo(initialCreateDate);
    }

    @Test
    public void testGetLocalDateNow() {
        final OffsetDateTime initialCreateDate = OffsetDateTime.of(2022, 2, 1, 19, 10, 30, 0, testTimeZone);
        getClock().setTime(initialCreateDate);

        LocalDate date = ClockManager.me().getLocalDateNow();

        assertThat(date).isAfterOrEqualTo(LocalDate.of(2022, 2, 1));
    }

    @Test
    public void testGetLocalDateTimeNow() {
        final OffsetDateTime initialCreateDate = OffsetDateTime.of(2022, 2, 1, 19, 10, 30, 0, testTimeZone);
        getClock().setTime(initialCreateDate);

        LocalDateTime dateTime = ClockManager.me().getLocalDateTimeNow();

        assertThat(dateTime).isEqualToIgnoringSeconds(LocalDateTime.of(2022, 2, 1, 19, 10, 30));
    }
}
