package com.vikadata.api.component;

import com.auth0.exception.Auth0Exception;
import com.auth0.json.mgmt.users.User;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.boot.autoconfigure.auth0.Auth0Template;
import com.vikadata.core.exception.BusinessException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class Auth0Service {

    @Autowired(required = false)
    private Auth0Template auth0Template;

    public boolean isOpen() {
        return auth0Template != null;
    }

    public String createUserInvitationLink(String email, String returnUrl) {
        try {
            String userId;
            User user = auth0Template.usersByEmail(email);
            if (user == null) {
                userId = auth0Template.createUser(email, false);
            }
            else {
                userId = user.getId();
            }
            String ticket = auth0Template.createPasswordResetTicket(userId, returnUrl);
            return ticket + "type=invite";
        }
        catch (Auth0Exception e) {
            log.error("can't create user with this email", e);
            throw new BusinessException("can't send with this email");
        }
    }
}
