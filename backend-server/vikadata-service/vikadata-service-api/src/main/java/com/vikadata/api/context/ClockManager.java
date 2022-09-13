package com.vikadata.api.context;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.clock.Clock;

import org.springframework.stereotype.Component;

import static com.vikadata.api.constants.TimeZoneConstants.DEFAULT_TIME_ZONE;

/**
 * Clock Manager
 */
@Component
@Slf4j
public class ClockManager {

    private final Clock clock;

    public ClockManager(Clock clock) {
        this.clock = clock;
    }

    public static ClockManager me() {
        return SpringContextHolder.getBean(ClockManager.class);
    }

    public LocalDate getLocalDateNow() {
        return clock.getToday(DEFAULT_TIME_ZONE);
    }

    public LocalDateTime getLocalDateTimeNow() {
        return clock.getNow(DEFAULT_TIME_ZONE).toLocalDateTime();
    }
}
