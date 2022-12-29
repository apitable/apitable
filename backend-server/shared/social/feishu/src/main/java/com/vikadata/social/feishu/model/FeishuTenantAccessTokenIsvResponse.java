package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Enterprise Invoke Credential Response Body (Store App)
 */
@Setter
@Getter
@ToString
public class FeishuTenantAccessTokenIsvResponse extends BaseResponse {

    private String tenantAccessToken;

    private int expire;
}
