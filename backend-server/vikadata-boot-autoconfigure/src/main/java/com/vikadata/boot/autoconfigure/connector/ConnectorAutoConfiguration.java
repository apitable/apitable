package com.vikadata.boot.autoconfigure.connector;

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
