package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;

/**
 * Get app access token
 */
@Setter
@Getter
public class FeishuPassportAccessToken {

    private String accessToken;

    private String tokenType;

    private int expiresIn;

    private int refreshExpiresIn;

    private String refreshToken;
}
