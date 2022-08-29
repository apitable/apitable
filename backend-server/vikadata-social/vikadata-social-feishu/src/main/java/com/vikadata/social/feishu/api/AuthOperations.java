package com.vikadata.social.feishu.api;

import com.vikadata.social.feishu.exception.FeishuApiException;
import com.vikadata.social.feishu.model.FeishuAccessToken;
import com.vikadata.social.feishu.model.FeishuUserAuthInfo;

/**
 * @author Shawn Deng
 * @date 2020-11-26 01:15:06
 */
public interface AuthOperations {

    /**
     * 刷新用户令牌
     * @param refreshToken 刷新令牌
     * @return FeishuAccessToken
     * @throws FeishuApiException 调用异常
     */
    FeishuAccessToken refreshUserAccessToken(String refreshToken) throws FeishuApiException;

    /**
     * 获取用户信息
     * @param userAccessToken 用户访问令牌
     * @return FeishuUserAuthInfo
     * @throws FeishuApiException 调用异常
     */
    FeishuUserAuthInfo getUserInfo(String userAccessToken) throws FeishuApiException;
}
