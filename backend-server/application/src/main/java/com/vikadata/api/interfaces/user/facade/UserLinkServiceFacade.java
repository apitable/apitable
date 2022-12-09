package com.vikadata.api.interfaces.user.facade;

import com.vikadata.api.interfaces.user.model.UserLinkRequest;
import com.vikadata.api.shared.cache.bean.SocialAuthInfo;
import com.vikadata.api.shared.cache.bean.UserLinkInfo;

public interface UserLinkServiceFacade {

    void createUserLink(UserLinkRequest userLinkRequest);

    void wrapperSocialAuthInfo(SocialAuthInfo authInfo);

    UserLinkInfo getUserLinkInfo(Long userId);
}
