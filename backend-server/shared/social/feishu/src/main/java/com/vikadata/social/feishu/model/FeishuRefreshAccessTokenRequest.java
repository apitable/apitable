package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;

/**
 * Get logged in user identity
 */
@Setter
@Getter
public class FeishuRefreshAccessTokenRequest {

    private String appAccessToken;

    private String grantType;

    private String refreshToken;
}
