package com.vikadata.boot.autoconfigure.data.analysis;

import com.sensorsdata.analytics.javasdk.SensorsAnalytics;

import com.vikadata.integration.sensors.DataTracker;
import com.vikadata.integration.sensors.SensorsDataTracker;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <p>
 * 数据分析自动配置
 * </p>
 *
 * @author Chambers
 * @date 2020/4/3
 */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(DataAnalyzeProperties.class)
@ConditionalOnProperty(value = "vikadata-starter.data.analyze.enabled", havingValue = "true")
public class DataAnalyzeAutoConfiguration {

    @Bean
    @ConditionalOnClass(SensorsAnalytics.class)
    @ConditionalOnProperty(value = "vikadata-starter.data.analyze.sensors.enabled", havingValue = "true")
    public DataTracker dataTracker() {
        return new SensorsDataTracker();
    }
}
