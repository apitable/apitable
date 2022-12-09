package com.vikadata.api.interfaces.user.facade;

import com.vikadata.api.interfaces.user.model.UserLinkRequest;
import com.vikadata.api.shared.cache.bean.SocialAuthInfo;
import com.vikadata.api.shared.cache.bean.UserLinkInfo;

public class DefaultUserLinkServiceFacadeImpl implements UserLinkServiceFacade {

    @Override
    public void createUserLink(UserLinkRequest userLinkRequest) {

    }

    @Override
    public void wrapperSocialAuthInfo(SocialAuthInfo authInfo) {

    }

    @Override
    public UserLinkInfo getUserLinkInfo(Long userId) {
        return null;
    }
}
