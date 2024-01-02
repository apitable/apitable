package com.apitable.shared.util;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import org.junit.jupiter.api.Test;

public class DateHelperTest {

    @Test
    void testSafeSetDayOfMonthWithExceedCurrentDayOfMonth() {
        int dayOfMonth = 31;
        LocalDate currentDate = LocalDate.of(2023, 6, 28);
        LocalDate safeDate = DateHelper.safeSetDayOfMonth(currentDate, dayOfMonth);
        assertThat(safeDate).isEqualTo(LocalDate.of(2023, 6, 30));
    }

    @Test
    void testSafeSetDayOfMonthWithNormalDayOfMonth() {
        int dayOfMonth = 27;
        LocalDate currentDate = LocalDate.of(2023, 6, 28);
        LocalDate safeDate = DateHelper.safeSetDayOfMonth(currentDate, dayOfMonth);
        assertThat(safeDate).isEqualTo(LocalDate.of(2023, 6, 27));
    }
}
