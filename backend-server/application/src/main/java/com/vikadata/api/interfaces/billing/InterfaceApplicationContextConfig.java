package com.vikadata.api.interfaces.billing;

import com.vikadata.api.interfaces.billing.facade.DefaultEntitlementServiceFacadeImpl;
import com.vikadata.api.interfaces.billing.facade.EntitlementServiceFacade;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class InterfaceApplicationContextConfig {

    @Bean
    @ConditionalOnMissingBean
    public EntitlementServiceFacade defaultEntitlementServiceFacade() {
        return new DefaultEntitlementServiceFacadeImpl();
    }
}
