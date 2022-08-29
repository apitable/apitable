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

    public static ClockManager me() {
        return SpringContextHolder.getBean(ClockManager.class);
    }

    public LocalDate getLocalDateNow() {
        return SpringContextHolder.getBean(Clock.class).getToday(DEFAULT_TIME_ZONE);
    }

    public LocalDateTime getLocalDateTimeNow() {
        return SpringContextHolder.getBean(Clock.class).getNow(DEFAULT_TIME_ZONE).toLocalDateTime();
    }
}
