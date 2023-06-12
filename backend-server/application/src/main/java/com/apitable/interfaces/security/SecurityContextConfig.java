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

package com.apitable.interfaces.security;

import com.apitable.interfaces.security.facade.BlackListServiceFacade;
import com.apitable.interfaces.security.facade.CaptchaServiceFacade;
import com.apitable.interfaces.security.facade.DefaultBlackListServiceFacadeImpl;
import com.apitable.interfaces.security.facade.DefaultCaptchaServiceFacadeImpl;
import com.apitable.interfaces.security.facade.DefaultHumanVerificationServiceFacadeImpl;
import com.apitable.interfaces.security.facade.DefaultWhiteListServiceFacadeImpl;
import com.apitable.interfaces.security.facade.HumanVerificationServiceFacade;
import com.apitable.interfaces.security.facade.WhiteListServiceFacade;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * security context config.
 */
@Configuration(proxyBeanMethods = false)
public class SecurityContextConfig {

    @Bean
    @ConditionalOnMissingBean
    public BlackListServiceFacade defaultBlackListServiceFacade() {
        return new DefaultBlackListServiceFacadeImpl();
    }

    @Bean
    @ConditionalOnMissingBean
    public WhiteListServiceFacade defaultWhiteListServiceFacadeImpl() {
        return new DefaultWhiteListServiceFacadeImpl();
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
