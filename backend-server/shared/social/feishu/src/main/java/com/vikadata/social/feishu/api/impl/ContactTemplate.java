package com.vikadata.social.feishu.api.impl;

import com.vikadata.social.feishu.AbstractFeishuOperations;
import com.vikadata.social.feishu.api.ContactOperations;
import com.vikadata.social.feishu.exception.FeishuApiException;
import com.vikadata.social.feishu.model.FeishuContactScopeResponse;

/**
 * @author Shawn Deng
 * @date 2020-12-01 11:49:54
 */
public class ContactTemplate extends AbstractFeishuOperations implements ContactOperations {

    private static final String CONTACT_SCOPE_URL = "/contact/v1/scope/get";

    public ContactTemplate(FeishuTemplate feishuTemplate) {
        super(feishuTemplate);
    }

    @Override
    public FeishuContactScopeResponse getContactScope(String tenantKey) throws FeishuApiException {
        return getFeishuTemplate().doGet(buildUri(CONTACT_SCOPE_URL), createAuthHeaders(getFeishuTemplate().getTenantAccessToken(tenantKey, false)), FeishuContactScopeResponse.class);
    }
}
