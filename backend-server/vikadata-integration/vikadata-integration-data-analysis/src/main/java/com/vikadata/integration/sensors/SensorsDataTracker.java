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
 * 数据跟踪器 - 神策实现类
 * </p>
 *
 * @author Chambers
 * @date 2020/4/8
 */
public class SensorsDataTracker implements DataTracker {

    private static final Logger LOGGER = LoggerFactory.getLogger(SensorsDataTracker.class);

    @Override
    public void track(String distinctId, boolean isLoginId, String eventType, Map<String, Object> properties) {
        LOGGER.info("记录事件:{}", eventType);
        try {
            SensorsAnalytics analytics = this.getAnalytics();
            analytics.track(distinctId, isLoginId, eventType, properties);
            analytics.shutdown();
        } catch (Exception e) {
            LOGGER.info("记录事件失败:{}:错误信息:", eventType, e);
        }
    }

    @Override
    public void trackSignUp(String loginId, String anonymousId) {
        LOGGER.info("记录用户注册事件");
        try {
            SensorsAnalytics analytics = this.getAnalytics();
            analytics.trackSignUp(loginId, anonymousId);
            analytics.shutdown();
        } catch (Exception e) {
            LOGGER.info("记录用户注册事件失败");
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
