package com.vikadata.social.feishu.api;

import com.vikadata.social.feishu.exception.FeishuApiException;
import com.vikadata.social.feishu.model.FeishuBatchUserRequest;
import com.vikadata.social.feishu.model.FeishuGetUserByUnionIdInfoResponse;
import com.vikadata.social.feishu.model.FeishuGetUserByUnionIdRequest;
import com.vikadata.social.feishu.model.FeishuUserDetailResponse;
import com.vikadata.social.feishu.model.builder.DeptIdType;
import com.vikadata.social.feishu.model.builder.UserIdType;
import com.vikadata.social.feishu.model.v3.FeishuV3UserResponse;
import com.vikadata.social.feishu.model.v3.FeishuV3UsersPager;
import com.vikadata.social.feishu.model.v3.FeishuV3UsersRequest;
import com.vikadata.social.feishu.model.v3.FeishuV3UsersResponse;

public interface UserOperations {

    /**
     * Get user information based on union id
     * @param tenantKey tenant key
     * @param request request param
     * @return FeishuGetUserByUnionIdInfoResponse
     * @throws FeishuApiException Feishu custom exception
     */
    @Deprecated
    FeishuGetUserByUnionIdInfoResponse batchGetUserIdInfoByUnionId(String tenantKey, FeishuGetUserByUnionIdRequest request) throws FeishuApiException;

    /**
     * Get user information in batches
     * @param tenantKey tenant key
     * @param request request param
     * @return FeishuUserDetailResponse
     * @throws FeishuApiException Feishu custom exception
     */
    @Deprecated
    FeishuUserDetailResponse batchGetUserDetail(String tenantKey, FeishuBatchUserRequest request) throws FeishuApiException;

    /**
     * Get a single user
     * @param tenantKey tenant key
     * @param userIdType User ID type
     * @return FeishuV3UserResponse
     */
    FeishuV3UserResponse getUser(String tenantKey, UserIdType userIdType);

    /**
     * get user list
     * @param tenantKey tenant key
     * @param request request param
     * @return FeishuV3UsersResponse
     */
    FeishuV3UsersResponse getUsers(String tenantKey, FeishuV3UsersRequest request);

    /**
     * Get user list pager
     * @param tenantKey tenant key
     * @param deptIdType department id type
     * @return FeishuV3UsersPager
     */
    FeishuV3UsersPager getUsers(String tenantKey, DeptIdType deptIdType);
}
