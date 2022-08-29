package com.vikadata.social.qq;

import com.vikadata.social.qq.model.AccessTokenInfo;
import com.vikadata.social.qq.model.TencentUserInfo;
import com.vikadata.social.qq.model.WebAppAuthInfo;

/**
 * <p>
 * QQ互联-网站应用 授权相关服务接口
 * </p>
 *
 * @author Chambers
 * @date 2020/10/16
 */
public interface AuthOperations {

    /**
     * 获取授权令牌信息
     *
     * @param code authorization code
     * @return AccessTokenInfo
     * @author Chambers
     * @date 2020/10/24
     */
    AccessTokenInfo getAccessToken(String code) throws QQException;

    /**
     * 获取 QQ 授权用户的应用ID信息
     *
     * @param accessToken accessToken
     * @return 授权信息
     * @author Chambers
     * @date 2020/10/16
     */
    WebAppAuthInfo getAuthInfo(String accessToken) throws QQException;

    /**
     * 获取 QQ 用户信息
     *
     * @param accessToken accessToken
     * @param appId       appId
     * @param openId      openId
     * @return 用户信息
     * @author Chambers
     * @date 2020/10/16
     */
    TencentUserInfo getTencentUserInfo(String accessToken, String appId, String openId) throws QQException;
}
