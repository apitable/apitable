package com.vikadata.boot.autoconfigure.data.analysis;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * <p>
 * 数据分析配置信息
 * </p>
 *
 * @author Chambers
 * @date 2020/4/3
 */
@ConfigurationProperties(prefix = "vikadata-starter.data.analyze")
public class DataAnalyzeProperties {

    /**
     * 是否启用
     */
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
