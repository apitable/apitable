package com.vikadata.api.modular.user;

import com.vikadata.api.enums.social.SocialPlatformType;

/**
 * <p>
 * Create Lark Tenant User Builder
 * </p>
 */
public class SocialFeishuBuilder extends BaseSocialUserBuilder<SocialFeishuBuilder> {

    private String weComUserId;

    public SocialFeishuBuilder() {
        this.socialPlatformType = SocialPlatformType.FEISHU;
    }

    @Override
    public SocialUser build() {
        return super.build();
    }

}
