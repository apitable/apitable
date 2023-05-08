package com.apitable.shared.config.properties;

import cn.hutool.core.util.BooleanUtil;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.TimeZone;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;


/**
 * system properties.
 *
 * @author Shawn Deng
 */
@Data
@ConfigurationProperties(prefix = "system")
public class SystemProperties {

    private String defaultTimeZone;

    private String testEnabled;

    public boolean isTestEnabled() {
        return BooleanUtil.toBoolean(testEnabled);
    }

    public ZoneId getTimeZoneId() {
        validTimeZone(defaultTimeZone);
        return ZoneId.of(defaultTimeZone);
    }

    public ZoneOffset getTimeZone() {
        return getTimeZoneId().getRules().getOffset(Instant.now());
    }

    private static void validTimeZone(String timeZoneString) {
        String[] availableIDs = TimeZone.getAvailableIDs();
        boolean validate =
            Arrays.asList(availableIDs).contains(timeZoneString);
        if (!validate) {
            throw new IllegalArgumentException("Invalid TimeZone Input : " + timeZoneString);
        }
    }
}
