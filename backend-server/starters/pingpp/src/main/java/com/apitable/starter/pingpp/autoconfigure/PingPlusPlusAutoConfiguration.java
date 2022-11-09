package com.apitable.starter.pingpp.autoconfigure;

import com.pingplusplus.Pingpp;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
