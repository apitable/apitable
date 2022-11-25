package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Get app_access_token
 */
@Setter
@Getter
@ToString
public class FeishuAppAccessTokenInternalRequest {

    private String appId;

    private String appSecret;
}
