package com.vikadata.api.interfaces.auth;

import com.vikadata.api.interfaces.auth.facade.AuthServiceFacade;
import com.vikadata.api.interfaces.auth.facade.DefaultAuthServiceFacadeImpl;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class AuthContextConfig {

    @Bean
    @ConditionalOnMissingBean
    public AuthServiceFacade defaultAuthServiceFacade() {
        return new DefaultAuthServiceFacadeImpl();
    }
}
