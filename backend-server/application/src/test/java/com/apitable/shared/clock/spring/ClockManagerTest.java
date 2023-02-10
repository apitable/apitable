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

package com.apitable.shared.clock.spring;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.junit.jupiter.api.Test;

import com.apitable.AbstractIntegrationTest;

import org.springframework.test.context.TestPropertySource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatNoException;

@TestPropertySource(properties = { "DEFAULT_TIME_ZONE=UTC" })
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
        final OffsetDateTime initialCreateDate = OffsetDateTime.of(2022, 2, 1, 19, 10, 30, 0, getTestTimeZone());
        getClock().setTime(initialCreateDate);

        LocalDate date = ClockManager.me().getLocalDateNow();

        LocalDate expectTime = LocalDate.of(2022, 2, 1);

        assertThat(date).isAfterOrEqualTo(expectTime);
    }

    @Test
    public void testGetLocalDateTimeNow() {
        final OffsetDateTime initialCreateDate = OffsetDateTime.of(2022, 2, 1, 19, 10, 30, 0, getTestTimeZone());
        getClock().setTime(initialCreateDate);

        LocalDateTime dateTime = ClockManager.me().getLocalDateTimeNow();

        System.out.println(dateTime);

        LocalDateTime expectTime = LocalDateTime.of(2022, 2, 1, 19, 10, 30, 0);

        System.out.println(expectTime);

        assertThat(dateTime).isEqualToIgnoringSeconds(expectTime);
    }
}
