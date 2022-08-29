package com.vikadata.api.modular.social.model;

import lombok.Data;

/**
 * 租户信息
 */
@Data
public class TenantBaseInfoDto {

    private String tenantKey;

    private String tenantName;

    private String avatar;
}
