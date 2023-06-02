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

package com.apitable.interfaces.user;

import com.apitable.interfaces.user.facade.DefaultInvitationServiceFacadeImpl;
import com.apitable.interfaces.user.facade.DefaultUserLinkServiceFacadeImpl;
import com.apitable.interfaces.user.facade.DefaultUserServiceFacadeImpl;
import com.apitable.interfaces.user.facade.InvitationServiceFacade;
import com.apitable.interfaces.user.facade.UserLinkServiceFacade;
import com.apitable.interfaces.user.facade.UserServiceFacade;
import com.apitable.organization.service.IMemberService;
import com.apitable.user.service.IUserService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * user context config.
 */
@Configuration(proxyBeanMethods = false)
public class UserContextConfig {

    @Bean
    @ConditionalOnMissingBean
    public UserServiceFacade defaultUserServiceFacade() {
        return new DefaultUserServiceFacadeImpl();
    }

    @Bean
    @ConditionalOnMissingBean
    public InvitationServiceFacade defaultInvitationServiceFacade(IUserService userService,
                                                                  IMemberService memberService) {
        return new DefaultInvitationServiceFacadeImpl(userService, memberService);
    }

    @Bean
    @ConditionalOnMissingBean
    public UserLinkServiceFacade defaultUserLinkServiceFacade() {
        return new DefaultUserLinkServiceFacadeImpl();
    }
}
