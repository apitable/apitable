package com.vikadata.api.interfaces.auth.facade;

import com.vikadata.api.interfaces.auth.model.AuthParam;
import com.vikadata.api.interfaces.auth.model.UserAuth;
import com.vikadata.api.interfaces.auth.model.UserLogout;

public class DefaultAuthServiceFacadeImpl implements AuthServiceFacade {

    @Override
    public UserAuth ssoLogin(AuthParam param) {
        return null;
    }

    @Override
    public UserLogout logout(UserAuth userAuth) {
        return null;
    }
}
