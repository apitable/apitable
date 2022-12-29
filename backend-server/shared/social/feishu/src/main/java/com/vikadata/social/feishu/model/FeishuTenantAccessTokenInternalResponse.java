package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Enterprise call credential response body (self-built application)
 */
@Setter
@Getter
@ToString
public class FeishuTenantAccessTokenInternalResponse extends BaseResponse {

    private String tenantAccessToken;

    private int expire;
}
