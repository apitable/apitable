package com.vikadata.boot.autoconfigure.connector;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * <p>
 * 连接器自动配置
 * </p>
 *
 * @author Chambers
 * @date 2021/6/21
 */
@Configuration(proxyBeanMethods = false)
@Import({ K11AutoConfiguration.class})
public class ConnectorAutoConfiguration {

}
