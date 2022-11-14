package com.vikadata.api.user.model;

import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.enterprise.social.enums.SocialAppType;

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
