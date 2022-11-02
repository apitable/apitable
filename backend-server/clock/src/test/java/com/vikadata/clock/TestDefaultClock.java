package com.vikadata.clock;

import java.time.LocalDate;
import java.time.ZoneOffset;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class TestDefaultClock {

    private DefaultClock clock;

    @BeforeEach
    public void setUp() {
        clock = new DefaultClock();
    }

    @Test
    public void testGetUTCToday() {
        LocalDate now = LocalDate.now(ZoneOffset.UTC);
        LocalDate today = clock.getUTCToday();
        assertThat(today).isEqualTo(now);
    }

    @Test
    public void testGetTodayWithTimeZone() {
        LocalDate now = LocalDate.now(ZoneOffset.ofHours(8));
        LocalDate today = clock.getToday(ZoneOffset.ofHours(8));
        assertThat(today).isEqualTo(now);
    }
}
