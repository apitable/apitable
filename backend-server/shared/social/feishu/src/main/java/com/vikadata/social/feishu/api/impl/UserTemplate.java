package com.vikadata.social.feishu.api.impl;

import com.vikadata.social.feishu.AbstractFeishuOperations;
import com.vikadata.social.feishu.api.UserOperations;
import com.vikadata.social.feishu.exception.FeishuApiException;
import com.vikadata.social.feishu.model.FeishuBatchUserRequest;
import com.vikadata.social.feishu.model.FeishuGetUserByUnionIdInfoResponse;
import com.vikadata.social.feishu.model.FeishuGetUserByUnionIdRequest;
import com.vikadata.social.feishu.model.FeishuUserDetailResponse;
import com.vikadata.social.feishu.model.builder.DeptIdType;
import com.vikadata.social.feishu.model.builder.UserIdType;
import com.vikadata.social.feishu.model.v3.FeishuV3UserRequest;
import com.vikadata.social.feishu.model.v3.FeishuV3UserResponse;
import com.vikadata.social.feishu.model.v3.FeishuV3UsersPager;
import com.vikadata.social.feishu.model.v3.FeishuV3UsersRequest;
import com.vikadata.social.feishu.model.v3.FeishuV3UsersResponse;

/**
 * User management interface
 */
public class UserTemplate extends AbstractFeishuOperations implements UserOperations {

    private static final String BATCH_GET_USER_URL = "/contact/v1/user/batch_get";

    private static final String GET_USER_BY_UNION_ID_URL = "/user/v1/union_id/batch_get/list";

    private static final String V3_GET_USER = "/contact/v3/users/%s";

    private static final String V3_GET_USERS = "/contact/v3/users";

    public UserTemplate(FeishuTemplate feishuTemplate) {
        super(feishuTemplate);
    }

    @Override
    public FeishuGetUserByUnionIdInfoResponse batchGetUserIdInfoByUnionId(String tenantKey, FeishuGetUserByUnionIdRequest request) throws FeishuApiException {
        return getFeishuTemplate().doGet(buildUrlWithVariables(buildUri(GET_USER_BY_UNION_ID_URL), request), createAuthHeaders(getFeishuTemplate().getTenantAccessToken(tenantKey, false)), FeishuGetUserByUnionIdInfoResponse.class);
    }

    @Override
    public FeishuUserDetailResponse batchGetUserDetail(String tenantKey, FeishuBatchUserRequest request) throws FeishuApiException {
        return getFeishuTemplate().doGet(buildUrlWithVariables(buildUri(BATCH_GET_USER_URL), request), createAuthHeaders(getFeishuTemplate().getTenantAccessToken(tenantKey, false)), FeishuUserDetailResponse.class);
    }

    @Override
    public FeishuV3UserResponse getUser(String tenantKey, UserIdType userIdType) {
        FeishuV3UserRequest request = new FeishuV3UserRequest();
        request.setUserIdType(userIdType.type());
        return getFeishuTemplate().doGet(buildUrlWithVariables(buildUri(String.format(V3_GET_USER, userIdType.value())), request), createAuthHeaders(getFeishuTemplate().getTenantAccessToken(tenantKey, false)), FeishuV3UserResponse.class);
    }

    @Override
    public FeishuV3UsersResponse getUsers(String tenantKey, FeishuV3UsersRequest request) {
        return getFeishuTemplate().doGet(buildUrlWithVariables(buildUri(V3_GET_USERS), request), createAuthHeaders(getFeishuTemplate().getTenantAccessToken(tenantKey, false)), FeishuV3UsersResponse.class);
    }

    @Override
    public FeishuV3UsersPager getUsers(String tenantKey, DeptIdType deptIdType) {
        return new FeishuV3UsersPager(this, tenantKey, deptIdType);
    }
}
