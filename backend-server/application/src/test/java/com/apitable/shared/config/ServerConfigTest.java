package com.apitable.shared.config;

import com.apitable.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;

import java.time.ZoneId;
import java.time.ZoneOffset;

import static org.assertj.core.api.Assertions.assertThat;

public class ServerConfigTest extends AbstractIntegrationTest {

    @Test
    void testDefaultTimeZoneId() {
        ZoneId zoneId = serverConfig.getTimeZoneId();
        assertThat(zoneId).isEqualTo(ZoneId.of("UTC"));
    }

    @Test
    void testDefaultTimeZone() {
        ZoneOffset timeZone = serverConfig.getTimeZone();
        assertThat(timeZone).isEqualTo(ZoneOffset.UTC);
    }
}
