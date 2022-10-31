package com.vikadata.boot.autoconfigure.task;

import com.xxl.job.core.executor.XxlJobExecutor;
import com.xxl.job.core.executor.impl.XxlJobSpringExecutor;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <p>
 * autoconfiguration of XXL job
 * </p>
 *
 * @author Chambers
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(XxlJobExecutor.class)
@EnableConfigurationProperties(JobProperties.class)
public class XxlAutoConfiguration {

    private final JobProperties properties;

    public XxlAutoConfiguration(JobProperties properties) {
        this.properties = properties;
    }

    @Bean
    public XxlJobSpringExecutor xxlJobExecutor() {
        XxlJobSpringExecutor xxlJobSpringExecutor = new XxlJobSpringExecutor();
        xxlJobSpringExecutor.setAdminAddresses(properties.getRegisterAddress());
        xxlJobSpringExecutor.setAppname(properties.getAppName());
        xxlJobSpringExecutor.setAddress(properties.getAddress());
        xxlJobSpringExecutor.setIp(properties.getIp());
        if (properties.getPort() != null && properties.getPort() != 0) {
            xxlJobSpringExecutor.setPort(properties.getPort());
        }
        xxlJobSpringExecutor.setAccessToken(properties.getAccessToken());
        xxlJobSpringExecutor.setLogPath(properties.getLogPath());
        if (properties.getLogRetentionDays() != null && properties.getLogRetentionDays() != 0) {
            xxlJobSpringExecutor.setLogRetentionDays(properties.getLogRetentionDays());
        }
        return xxlJobSpringExecutor;
    }
}
