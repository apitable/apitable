package com.apitable.shared.config;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.TimeZone;

/**
 * server config
 *
 * @author Shawn Deng
 */
@Data
@Component
@Slf4j
public class ServerConfig implements InitializingBean {

    @Value("${DEFAULT_TIME_ZONE:UTC}")
    private String timeZone;

    public ZoneId getTimeZoneId() {
        return ZoneId.of(timeZone);
    }

    public ZoneOffset getTimeZone() {
        return getTimeZoneId().getRules().getOffset(Instant.now());
    }

    @Override
    public void afterPropertiesSet() {
        String[] availableIDs = TimeZone.getAvailableIDs();
        boolean validate = Arrays.stream(availableIDs).anyMatch(zoneId -> zoneId.equals(timeZone));
        if (!validate) {
            throw new IllegalArgumentException("Invalid TimeZone Input : " + timeZone);
        }
        log.info("Server Default Region TimeZone: " + timeZone);
    }
}
