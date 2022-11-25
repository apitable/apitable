package com.vikadata.social.feishu.api.impl;

import cn.hutool.core.map.MapUtil;

import com.vikadata.social.feishu.AbstractFeishuOperations;
import com.vikadata.social.feishu.api.AuthOperations;
import com.vikadata.social.feishu.exception.FeishuApiException;
import com.vikadata.social.feishu.model.FeishuAccessToken;
import com.vikadata.social.feishu.model.FeishuAccessTokenResponse;
import com.vikadata.social.feishu.model.FeishuRefreshAccessTokenRequest;
import com.vikadata.social.feishu.model.FeishuUserAuthInfo;
import com.vikadata.social.feishu.model.FeishuUserInfoResponse;

/**
 * Authorization management interface implementation
 */
public class AuthTemplate extends AbstractFeishuOperations implements AuthOperations {

    private static final String REFRESH_ACCESS_TOKEN_URL = "/authen/v1/refresh_access_token";

    private static final String USER_INFO_URL = "/authen/v1/user_info";

    public AuthTemplate(FeishuTemplate feishuTemplate) {
        super(feishuTemplate);
    }

    @Override
    public FeishuAccessToken refreshUserAccessToken(String refreshToken) throws FeishuApiException {
        FeishuRefreshAccessTokenRequest request = new FeishuRefreshAccessTokenRequest();
        request.setAppAccessToken(getFeishuTemplate().getAppAccessToken(false));
        request.setRefreshToken(refreshToken);
        request.setGrantType("refresh_token");
        FeishuAccessTokenResponse response = getFeishuTemplate().doPost(buildUri(REFRESH_ACCESS_TOKEN_URL), MapUtil.newHashMap(), request, FeishuAccessTokenResponse.class);
        return response.getData();
    }

    @Override
    public FeishuUserAuthInfo getUserInfo(String userAccessToken) throws FeishuApiException {
        FeishuUserInfoResponse response = getFeishuTemplate().doGet(buildUri(USER_INFO_URL), createAuthHeaders(userAccessToken), FeishuUserInfoResponse.class);
        return response.getData();
    }
}
