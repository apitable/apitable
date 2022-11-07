package com.apitable.starter.autoconfigure.sensors;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * <p>
 * Data analysis configuration information
 * </p>
 *
 * @author Chambers
 */
@ConfigurationProperties(prefix = "vikadata-starter.data.analyze")
public class DataAnalyzeProperties {

    private boolean enabled = false;

    private DataAnalyzeProperties.Sensors sensors;

    public DataAnalyzeProperties() {
        sensors = new DataAnalyzeProperties.Sensors();
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public DataAnalyzeProperties.Sensors getSensors() {
        return sensors;
    }

    public void setSensors(DataAnalyzeProperties.Sensors sensors) {
        this.sensors = sensors;
    }

    /**
     * sensors properties
     */
    public static class Sensors {

        private boolean enabled = false;

        public Sensors() {
        }

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }
    }
}
