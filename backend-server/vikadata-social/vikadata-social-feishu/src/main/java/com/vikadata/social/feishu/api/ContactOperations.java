package com.vikadata.social.feishu.api;

import com.vikadata.social.feishu.exception.FeishuApiException;
import com.vikadata.social.feishu.model.FeishuContactScopeResponse;

/**
 * conntact nterface
 */
public interface ContactOperations {

    /**
     * Get the authorization scope of the address book
     *
     * @param tenantKey Tenant ID
     * @return FeishuContactScopeResponse
     * @throws FeishuApiException Feishu custom exception
     */
    FeishuContactScopeResponse getContactScope(String tenantKey) throws FeishuApiException;
}
