package com.vikadata.api.config;

import com.vikadata.api.config.properties.TestProperties;
import com.vikadata.clock.Clock;
import com.vikadata.clock.DefaultClock;
import com.vikadata.clock.MockClock;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 测试模式配置
 * @author Shawn Deng
 * @date 2022-05-25 16:38:52
 */
@Configuration(proxyBeanMethods = false)
public class TestModeConfig {

    private final TestProperties properties;

    public TestModeConfig(TestProperties properties) {
        this.properties = properties;
    }

    /**
     * 系统时钟配置
     * @return Clock Instance
     */
    @Bean
    public Clock configureClock() {
        if (properties.isTestMode()) {
            return new MockClock();
        }
        return new DefaultClock();
    }
}
