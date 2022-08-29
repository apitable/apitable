package com.vikadata.social.feishu.api;

import com.vikadata.social.feishu.model.FeishuTenantInfoResponse;

/**
 *
 * @author Shawn Deng
 * @date 2021-07-07 15:27:07
 */
public interface TenantOperations {

    /**
     * 获取企业信息
     * @param tenantKey 企业标识
     * @return FeishuTenantInfoResponse
     */
    FeishuTenantInfoResponse getTenantInfo(String tenantKey);
}
