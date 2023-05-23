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

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatNoException;

import com.apitable.AbstractIntegrationTest;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ClockManagerTest extends AbstractIntegrationTest {

    private static final Logger log = LoggerFactory.getLogger(ClockManagerTest.class);

    @Test
    public void testGetMockClock() {
        assertThatNoException().isThrownBy(() -> ClockManager.me().getMockClock());
    }

    @Test
    public void testGetUTCNow() {
        log.info("current time zone: {}", systemProperties.getTimeZone());
        final OffsetDateTime initialCreateDate =
            OffsetDateTime.of(2022, 2, 1,
                19, 10, 30, 0, systemProperties.getTimeZone());
        getClock().setTime(initialCreateDate);

        OffsetDateTime utcNow = ClockManager.me().getUtcNow();

        assertThat(utcNow).isAfterOrEqualTo(initialCreateDate);
    }

    @Test
    public void testGetLocalDateNow() {
        log.info("current time zone: {}", systemProperties.getTimeZone());
        final OffsetDateTime initialCreateDate =
            OffsetDateTime.of(2022, 2, 1,
                19, 10, 30, 0, systemProperties.getTimeZone());
        getClock().setTime(initialCreateDate);

        LocalDate date = ClockManager.me().getLocalDateNow();

        LocalDate expectTime = LocalDate.of(2022, 2, 1);

        assertThat(date).isAfterOrEqualTo(expectTime);
    }

    @Test
    public void testGetLocalDateTimeNow() {
        log.info("current time zone: {}", systemProperties.getTimeZone());
        // set expect time
        LocalDateTime expectTime = LocalDateTime.of(2022, 2, 1, 19, 10, 30, 0);
        log.info("expect time: {}", expectTime);
        // initial clock time
        OffsetDateTime instant =
            OffsetDateTime.ofInstant(expectTime.toInstant(systemProperties.getTimeZone()),
                systemProperties.getTimeZone());
        log.info("test instant offset: {}", instant);
        final OffsetDateTime initialCreateDate =
            OffsetDateTime.of(expectTime, systemProperties.getTimeZone());
        getClock().setTime(initialCreateDate);
        // system clock now localDateTime
        LocalDateTime now = ClockManager.me().getLocalDateTimeNow();
        log.info("system now date time: {}", now);
        // assert
        assertThat(now).isEqualToIgnoringSeconds(expectTime);
    }
}
