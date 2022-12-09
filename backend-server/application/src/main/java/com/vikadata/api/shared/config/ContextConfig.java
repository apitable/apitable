package com.vikadata.api.shared.config;

import com.vikadata.api.shared.cache.service.LoginUserCacheService;
import com.vikadata.api.shared.cache.service.UserSpaceCacheService;
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

    private final LoginUserCacheService loginUserCacheService;

    private final UserSpaceCacheService userSpaceCacheService;

    public ContextConfig(LoginUserCacheService loginUserCacheService, UserSpaceCacheService userSpaceCacheService) {
        this.loginUserCacheService = loginUserCacheService;
        this.userSpaceCacheService = userSpaceCacheService;
    }

    @Bean
    @ConditionalOnMissingBean
    public LoginContext loginContext() {
        return new LoginContext(loginUserCacheService, userSpaceCacheService);
    }

    @Bean
    @ConditionalOnMissingBean
    public I18nContext i18nContext(MessageSource messageSourc) {
        return new I18nContext(messageSourc);
    }

}
