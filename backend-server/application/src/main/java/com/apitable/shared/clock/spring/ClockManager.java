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

import com.apitable.core.util.SpringContextHolder;
import com.apitable.shared.clock.Clock;
import com.apitable.shared.clock.DefaultClock;
import com.apitable.shared.clock.MockClock;
import com.apitable.shared.config.properties.SystemProperties;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Component;

/**
 * clock manager.
 */
@Component
public class ClockManager implements InitializingBean {

    private Clock clock;

    private final SystemProperties systemProperties;

    public ClockManager(SystemProperties systemProperties) {
        this.systemProperties = systemProperties;
    }

    public static ClockManager me() {
        return SpringContextHolder.getBean(ClockManager.class);
    }

    /**
     * get mock clock.
     *
     * @return MockClock
     */
    public MockClock getMockClock() {
        if (!systemProperties.isTestEnabled()) {
            throw new UnsupportedOperationException(
                "System has not been configured to update the time");
        }
        return (MockClock) clock;
    }

    /**
     * get utc now.
     *
     * @return OffsetDateTime
     */
    public OffsetDateTime getUtcNow() {
        if ((clock instanceof MockClock)) {
            MockClock mockClock = (MockClock) clock;
            return mockClock.getUTCNow();
        }
        DefaultClock defaultClock = (DefaultClock) clock;
        return defaultClock.getUTCNow();
    }

    /**
     * get LocalDate of now.
     *
     * @return LocalDate
     */
    public LocalDate getLocalDateNow() {
        OffsetDateTime utcNow = getUtcNow();
        return utcNow.withOffsetSameInstant(systemProperties.getTimeZone()).toLocalDate();
    }

    /**
     * get LocalDateTime of now.
     *
     * @return LocalDateTime
     */
    public LocalDateTime getLocalDateTimeNow() {
        OffsetDateTime utcNow = getUtcNow();
        return utcNow.withOffsetSameInstant(systemProperties.getTimeZone()).toLocalDateTime();
    }

    /**
     * get server timezone.
     *
     * @return ZoneId
     */
    public ZoneId getDefaultTimeZone() {
        return this.systemProperties.getTimeZoneId();
    }

    public LocalDateTime convertMillis(long unixTimestamp) {
        Instant instant = Instant.ofEpochMilli(unixTimestamp);
        return LocalDateTime.ofInstant(instant, getDefaultTimeZone());
    }

    public long convertUnixTimeToMillis(LocalDateTime dateTime) {
        return dateTime.atZone(getDefaultTimeZone()).toInstant().toEpochMilli();
    }

    @Override
    public void afterPropertiesSet() {
        if (systemProperties.isTestEnabled()) {
            clock = new MockClock();
        } else {
            clock = new DefaultClock();
        }
    }
}
