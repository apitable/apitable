package com.apitable.starter.sensors.autoconfigure;

import com.apitable.starter.sensors.core.DataTracker;
import com.apitable.starter.sensors.core.SensorsDataTracker;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <p>
 * Automatic configuration of data analysis
 * </p>
 *
 * @author Chambers
 */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(DataAnalyzeProperties.class)
@ConditionalOnClass(DataTracker.class)
@ConditionalOnProperty(value = "vikadata-starter.data.analyze.enabled", havingValue = "true")
public class DataAnalyzeAutoConfiguration {

    @Bean
    @ConditionalOnProperty(value = "vikadata-starter.data.analyze.sensors.enabled", havingValue = "true")
    public DataTracker dataTracker() {
        return new SensorsDataTracker();
    }
}
