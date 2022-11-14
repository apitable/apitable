package com.vikadata.api.user.factory;

import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.user.model.SocialUser;

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
