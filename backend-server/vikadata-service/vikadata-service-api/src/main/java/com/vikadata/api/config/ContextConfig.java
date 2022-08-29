package com.vikadata.api.config;

import com.vikadata.api.cache.service.LoginUserService;
import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.context.I18nContext;
import com.vikadata.api.context.LoginContext;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <p>
 * 上下文组件配置
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/10/9 10:47
 */
@Configuration(proxyBeanMethods = false)
public class ContextConfig {

    private final LoginUserService loginUserService;

    private final UserSpaceService userSpaceService;

    public ContextConfig(LoginUserService loginUserService, UserSpaceService userSpaceService) {
        this.loginUserService = loginUserService;
        this.userSpaceService = userSpaceService;
    }

    /**
     * 登录上下文
     */
    @Bean
    @ConditionalOnMissingBean
    public LoginContext loginContext() {
        return new LoginContext(loginUserService, userSpaceService);
    }

    /**
     * i18n上下文
     */
    @Bean
    @ConditionalOnMissingBean
    public I18nContext i18nContext(MessageSource messageSourc) {
        return new I18nContext(messageSourc);
    }

}
