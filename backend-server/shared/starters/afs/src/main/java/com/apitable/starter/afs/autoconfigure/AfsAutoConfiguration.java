package com.apitable.starter.afs.autoconfigure;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <p>
 * autoconfiguration of human verification service
 * </p>
 *
 * @author Chambers
 */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(AfsProperties.class)
@ConditionalOnProperty(value = "vikadata-starter.afs.enabled", havingValue = "true")
@Import({ AliyunAfsAutoConfiguration.class })
public class AfsAutoConfiguration {

}
