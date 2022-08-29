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

/**
 * @author Shawn Deng
 * @date 2020-11-18 15:38:47
 */
public interface UserOperations {

    /**
     * 根据union_id获取用户信息
     * @param tenantKey 租户标识
     * @param request 请求参数
     * @return FeishuGetUserByUnionIdInfoResponse
     * @throws FeishuApiException
     */
    @Deprecated
    FeishuGetUserByUnionIdInfoResponse batchGetUserIdInfoByUnionId(String tenantKey, FeishuGetUserByUnionIdRequest request) throws FeishuApiException;

    /**
     * 批量获取用户信息
     *
     * @param tenantKey 租户标识
     * @param request   请求参数
     * @return FeishuUserDetailResponse
     * @author Shawn Deng
     * @date 2020/12/7 11:18
     */
    @Deprecated
    FeishuUserDetailResponse batchGetUserDetail(String tenantKey, FeishuBatchUserRequest request) throws FeishuApiException;

    /**
     * 获取单个用户
     * @param tenantKey 企业标识
     * @param userIdType 用户ID类型
     * @return FeishuV3UserResponse
     */
    FeishuV3UserResponse getUser(String tenantKey, UserIdType userIdType);

    /**
     * 获取用户列表
     * @param tenantKey 企业标识
     * @param request 请求参数
     * @return FeishuV3UsersResponse
     */
    FeishuV3UsersResponse getUsers(String tenantKey, FeishuV3UsersRequest request);

    /**
     * 获取用户列表分页器
     * @param tenantKey 企业标识
     * @param deptIdType 部门id类型
     * @return FeishuV3UsersPager
     */
    FeishuV3UsersPager getUsers(String tenantKey, DeptIdType deptIdType);
}
