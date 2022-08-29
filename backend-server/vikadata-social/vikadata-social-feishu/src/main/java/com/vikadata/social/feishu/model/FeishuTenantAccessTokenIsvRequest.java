package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 企业调用凭证（商店应用）
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/23 12:10
 */
@Setter
@Getter
@ToString
public class FeishuTenantAccessTokenIsvRequest {

    private String appAccessToken;

    private String tenantKey;
}
