package com.vikadata.social.feishu.api;

import com.vikadata.social.feishu.model.FeishuAdminUserListResponse;
import com.vikadata.social.feishu.model.FeishuCheckUserAdminRequest;
import com.vikadata.social.feishu.model.FeishuCheckUserAdminResponse;
import com.vikadata.social.feishu.model.FeishuOrderDetailResponse;

/**
 * @author Shawn Deng
 * @date 2020-11-18 15:59:48
 */
public interface AppOperations {

    FeishuAdminUserListResponse getAppAdminList(String tenantKey);

    FeishuCheckUserAdminResponse checkAppAdmin(String tenantKey, FeishuCheckUserAdminRequest request);

    FeishuOrderDetailResponse getOrderDetail(String tenantKey, String orderId);

}
