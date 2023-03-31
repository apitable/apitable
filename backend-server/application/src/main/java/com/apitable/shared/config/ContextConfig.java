/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.shared.config;

import com.apitable.shared.cache.service.LoginUserCacheService;
import com.apitable.shared.cache.service.UserSpaceCacheService;
import com.apitable.shared.context.ClientOriginInfoContext;
import com.apitable.shared.context.I18nContext;
import com.apitable.shared.context.LoginContext;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


/**
 * <p>
 * context config.
 * </p>
 *
 * @author Shawn Deng
 */
@Configuration(proxyBeanMethods = false)
public class ContextConfig {

    private final LoginUserCacheService loginUserCacheService;

    private final UserSpaceCacheService userSpaceCacheService;

    public ContextConfig(LoginUserCacheService loginUserCacheService,
                         UserSpaceCacheService userSpaceCacheService) {
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

    @Bean
    @ConditionalOnMissingBean
    public ClientOriginInfoContext clientOriginInfoContext() {
        return new ClientOriginInfoContext();
    }

}
