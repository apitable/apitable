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

import lombok.extern.slf4j.Slf4j;

import com.apitable.core.util.SpringContextHolder;
import com.apitable.shared.clock.Clock;
import com.apitable.shared.clock.DefaultClock;
import com.apitable.shared.clock.MockClock;
import com.apitable.shared.component.SystemEnvironmentVariable;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Component;

import static com.apitable.shared.constants.TimeZoneConstants.DEFAULT_TIME_ZONE;

@Component
@Slf4j
public class ClockManager implements InitializingBean {

    private Clock clock;

    private final SystemEnvironmentVariable environmentVariable;

    public ClockManager(SystemEnvironmentVariable environmentVariable) {
        this.environmentVariable = environmentVariable;
    }

    public static ClockManager me() {
        return SpringContextHolder.getBean(ClockManager.class);
    }

    public MockClock getMockClock() {
        if (!environmentVariable.isTestEnabled()) {
            throw new UnsupportedOperationException("System has not been configured to update the time");
        }
        return (MockClock) clock;
    }


    public OffsetDateTime getUTCNow() {
        if ((clock instanceof MockClock)) {
            log.info("mock clock");
            MockClock mockClock = (MockClock) clock;
            return mockClock.getUTCNow();
        }
        DefaultClock defaultClock = (DefaultClock) clock;
        return defaultClock.getUTCNow();
    }

    public LocalDate getLocalDateNow() {
        OffsetDateTime utcNow = getUTCNow();
        log.info("utc now: {}", utcNow);
        return utcNow.withOffsetSameInstant(DEFAULT_TIME_ZONE).toLocalDate();
    }

    public LocalDateTime getLocalDateTimeNow() {
        OffsetDateTime utcNow = getUTCNow();
        log.info("utc now: {}", utcNow);
        return utcNow.withOffsetSameInstant(DEFAULT_TIME_ZONE).toLocalDateTime();
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        if (environmentVariable.isTestEnabled()) {
            clock = new MockClock();
        }
        else {
            clock = new DefaultClock();
        }
    }
}
