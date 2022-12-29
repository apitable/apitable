package com.vikadata.api.interfaces.widget;

import com.vikadata.api.interfaces.widget.facade.DefaultWidgetServiceFacadeImpl;
import com.vikadata.api.interfaces.widget.facade.WidgetServiceFacade;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class WidgetContextConfig {

    @Bean
    @ConditionalOnMissingBean
    public WidgetServiceFacade defaultWidgetServiceFacade() {
        return new DefaultWidgetServiceFacadeImpl();
    }
}
