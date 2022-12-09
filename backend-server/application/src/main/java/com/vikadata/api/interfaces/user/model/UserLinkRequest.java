package com.vikadata.api.interfaces.user.model;

import com.vikadata.api.shared.cache.bean.SocialAuthInfo;

public class UserLinkRequest {

    private Long userId;

    private SocialAuthInfo authInfo;

    public UserLinkRequest(Long userId, SocialAuthInfo authInfo) {
        this.userId = userId;
        this.authInfo = authInfo;
    }

    public Long getUserId() {
        return userId;
    }

    public SocialAuthInfo getAuthInfo() {
        return authInfo;
    }
}
