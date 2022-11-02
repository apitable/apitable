package com.vikadata.api.component.clock;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.config.properties.TestProperties;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.clock.Clock;
import com.vikadata.clock.DefaultClock;
import com.vikadata.clock.MockClock;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Component;

import static com.vikadata.api.constants.TimeZoneConstants.DEFAULT_TIME_ZONE;

@Component
@Slf4j
public class ClockManager implements InitializingBean {

    private final TestProperties testProperties;

    private Clock clock;

    public ClockManager(TestProperties testProperties) {
        this.testProperties = testProperties;
    }

    public static ClockManager me() {
        return SpringContextHolder.getBean(ClockManager.class);
    }

    public MockClock getMockClock() {
        if (!testProperties.isTestMode()) {
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
        if (testProperties.isTestMode()) {
            clock = new MockClock();
        }
        else {
            clock = new DefaultClock();
        }
    }
}
