package com.vikadata.social.feishu.api;

import com.vikadata.social.feishu.model.FeishuTenantInfoResponse;

public interface TenantOperations {

    /**
     * Get business information
     * @param tenantKey tenant key
     * @return FeishuTenantInfoResponse
     */
    FeishuTenantInfoResponse getTenantInfo(String tenantKey);
}
