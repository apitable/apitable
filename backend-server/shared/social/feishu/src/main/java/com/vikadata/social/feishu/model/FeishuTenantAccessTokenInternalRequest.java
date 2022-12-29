package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Enterprise call certificate (self-built application)
 */
@Setter
@Getter
@ToString
public class FeishuTenantAccessTokenInternalRequest {

    private String appId;

    private String appSecret;
}
