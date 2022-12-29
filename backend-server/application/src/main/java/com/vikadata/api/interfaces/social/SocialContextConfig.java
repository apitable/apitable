package com.vikadata.api.interfaces.social;

import com.vikadata.api.interfaces.social.facade.DefaultSocialServiceFacade;
import com.vikadata.api.interfaces.social.facade.SocialServiceFacade;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class SocialContextConfig {

    @Bean
    @ConditionalOnMissingBean
    public SocialServiceFacade defaultSocialServiceFacade() {
        return new DefaultSocialServiceFacade();
    }
}
