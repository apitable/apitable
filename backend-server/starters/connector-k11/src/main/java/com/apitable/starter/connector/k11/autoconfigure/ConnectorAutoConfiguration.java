package com.apitable.starter.connector.k11.autoconfigure;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * connector autoconfiguration
 * @author Chambers
 */
@Configuration(proxyBeanMethods = false)
@Import({ K11AutoConfiguration.class})
public class ConnectorAutoConfiguration {

}
