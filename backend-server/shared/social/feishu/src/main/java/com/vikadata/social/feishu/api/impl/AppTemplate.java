package com.vikadata.social.feishu.api.impl;

import com.vikadata.social.feishu.AbstractFeishuOperations;
import com.vikadata.social.feishu.api.AppOperations;
import com.vikadata.social.feishu.model.FeishuAdminUserListResponse;
import com.vikadata.social.feishu.model.FeishuCheckUserAdminRequest;
import com.vikadata.social.feishu.model.FeishuCheckUserAdminResponse;
import com.vikadata.social.feishu.model.FeishuOrderDetailRequest;
import com.vikadata.social.feishu.model.FeishuOrderDetailResponse;

/**
 * Application management interface
 */
public class AppTemplate extends AbstractFeishuOperations implements AppOperations {

    private static final String ADMIN_LIST_URL = "/user/v4/app_admin_user/list";

    private static final String CHECK_USER_ADMIN_URL = "/application/v3/is_user_admin";


    private static final String PAY_ORDER_DETAIL_URL = "/pay/v1/order/get";

    public AppTemplate(FeishuTemplate feishuTemplate) {
        super(feishuTemplate);

    }

    @Override
    public FeishuAdminUserListResponse getAppAdminList(String tenantKey) {
        return getFeishuTemplate().doGet(buildUri(ADMIN_LIST_URL), createAuthHeaders(getFeishuTemplate().getTenantAccessToken(tenantKey, false)), FeishuAdminUserListResponse.class);
    }

    @Override
    public FeishuCheckUserAdminResponse checkAppAdmin(String tenantKey, FeishuCheckUserAdminRequest request) {
        return getFeishuTemplate().doGet(buildUrlWithVariables(buildUri(CHECK_USER_ADMIN_URL), request), createAuthHeaders(getFeishuTemplate().getTenantAccessToken(tenantKey, false)), FeishuCheckUserAdminResponse.class);
    }

    @Override
    public FeishuOrderDetailResponse getOrderDetail(String tenantKey, String orderId) {
        FeishuOrderDetailRequest request = new FeishuOrderDetailRequest();
        request.setOrderId(orderId);
        return getFeishuTemplate().doGet(buildUrlWithVariables(buildUri(PAY_ORDER_DETAIL_URL), request),
                createAuthHeaders(getFeishuTemplate().getTenantAccessToken(tenantKey, false)),
                FeishuOrderDetailResponse.class);
    }
}
