package com.apitable.interfaces.ai;

import com.apitable.interfaces.ai.facade.AiServiceFacade;
import com.apitable.interfaces.ai.facade.DefaultAiServiceFacadeImpl;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * AI context configuration.
 *
 * @author Shawn Deng
 */
@Configuration(proxyBeanMethods = false)
public class AiContextConfig {

    @Bean
    @ConditionalOnMissingBean
    public AiServiceFacade defaultAiServiceFacade() {
        return new DefaultAiServiceFacadeImpl();
    }
}
