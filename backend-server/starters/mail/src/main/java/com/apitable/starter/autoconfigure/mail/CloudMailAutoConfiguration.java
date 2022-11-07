package com.apitable.starter.autoconfigure.mail;

import com.vikadata.integration.mail.CloudMailSender;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <p>
 * Cloud platform email push automation configuration
 * </p>
 *
 * @author Chambers
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(CloudMailSender.class)
@EnableConfigurationProperties(CloudMailProperties.class)
@ConditionalOnProperty(value = "vikadata-starter.mail.enabled", havingValue = "true")
@Import({ TencentMailAutoConfiguration.class })
public class CloudMailAutoConfiguration {


}
