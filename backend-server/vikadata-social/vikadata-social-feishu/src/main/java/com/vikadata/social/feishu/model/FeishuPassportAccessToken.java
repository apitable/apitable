package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;

/**
 * 应用获取AccessToken
 * @author Shawn Deng
 * @date 2020-11-26 15:49:38
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
