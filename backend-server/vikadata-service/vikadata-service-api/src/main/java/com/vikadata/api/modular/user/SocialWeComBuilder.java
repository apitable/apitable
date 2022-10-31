package com.vikadata.api.modular.user;

import com.vikadata.api.enums.social.SocialPlatformType;

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
