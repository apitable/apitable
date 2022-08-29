package com.vikadata.api.modular.user;

import com.vikadata.api.enums.social.SocialPlatformType;

/**
 * <p>
 * 创建企业微信租户User Builder
 * </p>
 *
 * @author Pengap
 * @date 2021/8/23 14:54:15
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
