package com.vikadata.api.interfaces.security;

import com.vikadata.api.interfaces.security.facade.BlackListServiceFacade;
import com.vikadata.api.interfaces.security.facade.CaptchaServiceFacade;
import com.vikadata.api.interfaces.security.facade.DefaultBlackListServiceFacadeImpl;
import com.vikadata.api.interfaces.security.facade.DefaultCaptchaServiceFacadeImpl;
import com.vikadata.api.interfaces.security.facade.DefaultHumanVerificationServiceFacadeImpl;
import com.vikadata.api.interfaces.security.facade.HumanVerificationServiceFacade;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class SecurityContextConfig {

    @Bean
    @ConditionalOnMissingBean
    public BlackListServiceFacade defaultBlackListServiceFacade() {
        return new DefaultBlackListServiceFacadeImpl();
    }

    @Bean
    @ConditionalOnMissingBean
    public HumanVerificationServiceFacade defaultHumanVerificationServiceFacade() {
        return new DefaultHumanVerificationServiceFacadeImpl();
    }

    @Bean
    @ConditionalOnMissingBean
    public CaptchaServiceFacade defaultCaptchaServiceFacade() {
        return new DefaultCaptchaServiceFacadeImpl();
    }
}
