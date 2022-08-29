package com.vikadata.boot.autoconfigure.pingpp;

import com.pingplusplus.Pingpp;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 *
 * @author Shawn Deng
 * @date 2022-02-15 17:34:54
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(Pingpp.class)
@EnableConfigurationProperties(PingProperties.class)
@ConditionalOnProperty(value = "vikadata-starter.pingpp.enabled", havingValue = "true")
public class PingPlusPlusAutoConfiguration {

    private final PingProperties pingProperties;

    public PingPlusPlusAutoConfiguration(PingProperties pingProperties) {
        this.pingProperties = pingProperties;
    }

    @Bean
    public PingInit pingInit() {
        return new PingInit(pingProperties);
    }
}
