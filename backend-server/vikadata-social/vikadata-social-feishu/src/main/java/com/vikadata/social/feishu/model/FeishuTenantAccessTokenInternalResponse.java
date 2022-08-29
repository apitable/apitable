package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 企业调用凭证响应体（自建应用）
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/23 12:08
 */
@Setter
@Getter
@ToString
public class FeishuTenantAccessTokenInternalResponse extends BaseResponse {

    private String tenantAccessToken;

    private int expire;
}
