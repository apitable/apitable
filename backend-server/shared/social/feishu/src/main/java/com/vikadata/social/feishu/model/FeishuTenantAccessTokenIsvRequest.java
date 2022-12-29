package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Enterprise Call Credentials (Store App)
 */
@Setter
@Getter
@ToString
public class FeishuTenantAccessTokenIsvRequest {

    private String appAccessToken;

    private String tenantKey;
}
