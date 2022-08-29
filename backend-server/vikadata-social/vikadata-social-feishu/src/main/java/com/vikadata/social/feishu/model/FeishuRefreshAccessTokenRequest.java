package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;

/**
 * 获取登录用户身份
 *
 * @author Shawn Deng
 * @date 2020-11-26 10:13:51
 */
@Setter
@Getter
public class FeishuRefreshAccessTokenRequest {

    private String appAccessToken;

    private String grantType;

    private String refreshToken;
}
