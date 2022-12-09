package com.vikadata.api.interfaces.user;

import com.vikadata.api.interfaces.user.facade.DefaultInvitationServiceFacadeImpl;
import com.vikadata.api.interfaces.user.facade.DefaultUserLinkServiceFacadeImpl;
import com.vikadata.api.interfaces.user.facade.DefaultUserServiceFacadeImpl;
import com.vikadata.api.interfaces.user.facade.InvitationServiceFacade;
import com.vikadata.api.interfaces.user.facade.UserLinkServiceFacade;
import com.vikadata.api.interfaces.user.facade.UserServiceFacade;
import com.vikadata.api.organization.service.IMemberService;
import com.vikadata.api.user.service.IUserService;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class UserContextConfig {

    @Bean
    @ConditionalOnMissingBean
    public UserServiceFacade defaultUserServiceFacade() {
        return new DefaultUserServiceFacadeImpl();
    }

    @Bean
    @ConditionalOnMissingBean
    public InvitationServiceFacade defaultInvitationServiceFacade(IUserService iUserService, IMemberService iMemberService) {
        return new DefaultInvitationServiceFacadeImpl(iUserService, iMemberService);
    }

    @Bean
    @ConditionalOnMissingBean
    public UserLinkServiceFacade defaultUserLinkServiceFacade() {
        return new DefaultUserLinkServiceFacadeImpl();
    }
}
