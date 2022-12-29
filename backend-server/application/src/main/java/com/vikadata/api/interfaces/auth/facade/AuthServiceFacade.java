package com.vikadata.api.interfaces.auth.facade;

import com.vikadata.api.interfaces.auth.model.AuthParam;
import com.vikadata.api.interfaces.auth.model.UserAuth;
import com.vikadata.api.interfaces.auth.model.UserLogout;

public interface AuthServiceFacade {

    UserAuth ssoLogin(AuthParam param);

    UserLogout logout(UserAuth userAuth);
}
