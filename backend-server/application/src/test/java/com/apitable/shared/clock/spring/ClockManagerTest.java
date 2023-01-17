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

import com.apitable.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

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
        final OffsetDateTime initialCreateDate = OffsetDateTime.of(2022, 2, 1, 19, 10, 30, 0, serverConfig.getTimeZone());
        getClock().setTime(initialCreateDate);

        LocalDate date = ClockManager.me().getLocalDateNow();

        assertThat(date).isAfterOrEqualTo(LocalDate.of(2022, 2, 1));
    }

    @Test
    public void testGetLocalDateTimeNow() {
        final OffsetDateTime initialCreateDate = OffsetDateTime.of(2022, 2, 1, 19, 10, 30, 0, serverConfig.getTimeZone());
        getClock().setTime(initialCreateDate);

        LocalDateTime dateTime = ClockManager.me().getLocalDateTimeNow();

        assertThat(dateTime).isEqualToIgnoringSeconds(LocalDateTime.of(2022, 2, 1, 19, 10, 30));
    }
}
