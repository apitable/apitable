package com.apitable.shared.config;

import static org.assertj.core.api.Assertions.assertThat;

import com.apitable.AbstractIntegrationTest;
import java.time.ZoneId;
import java.time.ZoneOffset;
import org.junit.jupiter.api.Test;

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
