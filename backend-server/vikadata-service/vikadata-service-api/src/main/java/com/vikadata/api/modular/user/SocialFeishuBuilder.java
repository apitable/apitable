package com.vikadata.api.modular.user;

import com.vikadata.api.enums.social.SocialPlatformType;

/**
 * <p>
 * 创建飞书租户User Builder
 * </p>
 *
 * @author Pengap
 * @date 2021/8/23 14:54:15
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
