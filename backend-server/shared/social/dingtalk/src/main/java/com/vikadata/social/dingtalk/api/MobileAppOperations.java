package com.vikadata.social.dingtalk.api;


import com.vikadata.social.dingtalk.model.UserInfo;

/**
 * Mobile application management interface
 */
public interface MobileAppOperations {

    /**
     *  Third-party website login: obtain user information through temporary authorization code Code
     *
     * @param tmpAuthCode Temporary Authorization Code Code
     * @return UserInfo
     */
    UserInfo getUserInfoByCode(String tmpAuthCode);
}
