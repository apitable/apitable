package com.vikadata.api.modular.user;

import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.modular.social.enums.SocialAppType;

/**
 *
 * @author Shawn Deng
 * @date 2021-07-06 16:53:40
 */
public interface User {

    String getAreaCode();

    String getTelephoneNumber();

    String getEmailAddress();

    String getPassword();

    String getNickName();

    String getAvatar();

    String getAppId();

    String getTenantId();

    String getOpenId();

    String getUnionId();

    SocialPlatformType getSocialPlatformType();

    SocialAppType getSocialAppType();

}
