package com.vikadata.api.user.factory;

import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.user.model.SocialUser;

/**
 * <p>
 * Create WeCom Tenant User Builder
 * </p>
 */
public class SocialWeComBuilder extends BaseSocialUserBuilder<SocialWeComBuilder> {

    private String appId;

    public SocialWeComBuilder() {
        this.socialPlatformType = SocialPlatformType.WECOM;
    }

    public SocialWeComBuilder appId(String appId) {
        this.appId = appId;
        return this;
    }

    @Override
    public SocialUser build() {
        SocialUser su = super.build();
        su.setAppId(this.appId);
        return su;
    }

}
