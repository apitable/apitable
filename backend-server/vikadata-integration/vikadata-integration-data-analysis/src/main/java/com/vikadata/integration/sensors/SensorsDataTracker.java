package com.vikadata.integration.sensors;

import java.io.File;
import java.io.IOException;
import java.net.InetAddress;
import java.util.Map;

import com.sensorsdata.analytics.javasdk.SensorsAnalytics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * <p>
 * Data Tracker - Shence Implementation Class
 * </p>
 *
 */
public class SensorsDataTracker implements DataTracker {

    private static final Logger LOGGER = LoggerFactory.getLogger(SensorsDataTracker.class);

    @Override
    public void track(String distinctId, boolean isLoginId, String eventType, Map<String, Object> properties) {
        LOGGER.info("record events:{}", eventType);
        try {
            SensorsAnalytics analytics = this.getAnalytics();
            analytics.track(distinctId, isLoginId, eventType, properties);
            analytics.shutdown();
        } catch (Exception e) {
            LOGGER.info("failure to record events:{}:error message:", eventType, e);
        }
    }

    @Override
    public void trackSignUp(String loginId, String anonymousId) {
        LOGGER.info("record user registration events");
        try {
            SensorsAnalytics analytics = this.getAnalytics();
            analytics.trackSignUp(loginId, anonymousId);
            analytics.shutdown();
        } catch (Exception e) {
            LOGGER.info("failed to record user registration events");
        }
    }

    private SensorsAnalytics getAnalytics() throws IOException {
        String hostname = InetAddress.getLocalHost().getHostName();
        File logPath = new File("/logs/sensors/" + hostname + "-logs");
        if (!logPath.exists()) {
            logPath.mkdirs();
        }
        return new SensorsAnalytics(
            new SensorsAnalytics.ConcurrentLoggingConsumer(logPath.getAbsolutePath() + "/service_log"));
    }
}
