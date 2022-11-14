package com.vikadata.api.shared.config;

import com.vikadata.api.shared.cache.service.LoginUserService;
import com.vikadata.api.shared.cache.service.UserSpaceService;
import com.vikadata.api.shared.context.I18nContext;
import com.vikadata.api.shared.context.LoginContext;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <p>
 * context config
 * </p>
 *
 * @author Shawn Deng
 */
@Configuration(proxyBeanMethods = false)
public class ContextConfig {

    private final LoginUserService loginUserService;

    private final UserSpaceService userSpaceService;

    public ContextConfig(LoginUserService loginUserService, UserSpaceService userSpaceService) {
        this.loginUserService = loginUserService;
        this.userSpaceService = userSpaceService;
    }

    @Bean
    @ConditionalOnMissingBean
    public LoginContext loginContext() {
        return new LoginContext(loginUserService, userSpaceService);
    }

    @Bean
    @ConditionalOnMissingBean
    public I18nContext i18nContext(MessageSource messageSourc) {
        return new I18nContext(messageSourc);
    }

}
