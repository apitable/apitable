package com.vikadata.social.qq;

import com.vikadata.social.qq.model.AccessTokenInfo;
import com.vikadata.social.qq.model.TencentUserInfo;
import com.vikadata.social.qq.model.WebAppAuthInfo;

/**
 * QQ internet-web application authorization-related service operations
 */
public interface AuthOperations {

    /**
     * get access token by authorization code
     *
     * @param code authorization code
     * @return AccessTokenInfo
     */
    AccessTokenInfo getAccessToken(String code) throws QQException;

    /**
     * get QQ web app authorization info
     *
     * @param accessToken accessToken
     * @return WebAppAuthInfo
     */
    WebAppAuthInfo getAuthInfo(String accessToken) throws QQException;

    /**
     * get QQ user info
     *
     * @param accessToken accessToken
     * @param appId       appId
     * @param openId      openId
     */
    TencentUserInfo getTencentUserInfo(String accessToken, String appId, String openId) throws QQException;
}
