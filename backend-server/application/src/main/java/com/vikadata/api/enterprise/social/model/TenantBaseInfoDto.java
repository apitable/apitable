package com.vikadata.api.enterprise.social.model;

import lombok.Data;

/**
 * Tenant information
 */
@Data
public class TenantBaseInfoDto {

    private String tenantKey;

    private String tenantName;

    private String avatar;
}
