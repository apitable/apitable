package com.vikadata.boot.autoconfigure.idaas;

import com.vikadata.integration.idaas.IdaasConfig;
import com.vikadata.integration.idaas.IdaasTemplate;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(IdaasProperties.class)
@ConditionalOnProperty(value = "vikadata-starter.idaas.enabled", havingValue = "true")
public class IdaasAutoConfiguration {

    @Bean
    public IdaasTemplate idaasTemplate(IdaasProperties idaasProperties) {
        IdaasConfig idaasConfig = new IdaasConfig();
        idaasConfig.setSystemHost(idaasProperties.getManageHost());
        idaasConfig.setContactHost(idaasProperties.getContactHost());

        return new IdaasTemplate(idaasConfig);
    }

}
