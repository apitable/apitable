package com.vikadata.social.feishu.api;

import com.vikadata.social.feishu.exception.FeishuApiException;
import com.vikadata.social.feishu.model.FeishuBatchGetDepartmentDetailListRequest;
import com.vikadata.social.feishu.model.FeishuDepartmentDetailListResponse;
import com.vikadata.social.feishu.model.FeishuDepartmentDetailResponse;
import com.vikadata.social.feishu.model.FeishuDepartmentListPager;
import com.vikadata.social.feishu.model.FeishuDepartmentListRequest;
import com.vikadata.social.feishu.model.FeishuDepartmentListResponse;
import com.vikadata.social.feishu.model.FeishuGetDepartmentDetailRequest;
import com.vikadata.social.feishu.model.FeishuUserDetailListPager;
import com.vikadata.social.feishu.model.FeishuUserDetailListRequest;
import com.vikadata.social.feishu.model.FeishuUserDetailListResponse;
import com.vikadata.social.feishu.model.builder.DeptIdType;
import com.vikadata.social.feishu.model.v3.FeishuV3DeptResponse;
import com.vikadata.social.feishu.model.v3.FeishuV3DeptsPager;
import com.vikadata.social.feishu.model.v3.FeishuV3DeptsRequest;
import com.vikadata.social.feishu.model.v3.FeishuV3DeptsResponse;
import com.vikadata.social.feishu.model.v3.FeishuV3GetParentDeptsPager;
import com.vikadata.social.feishu.model.v3.FeishuV3GetParentDeptsRequest;
import com.vikadata.social.feishu.model.v3.FeishuV3GetParentDeptsResponse;

/**
 * Feishu Department Management Interface
 */
public interface DepartmentOperations {

    /**
     * Get a list of sub-departments
     *
     * @param tenantKey tenant key
     * @param request   request param
     * @return Department List
     * @throws FeishuApiException exception
     */
    FeishuDepartmentListResponse getSubDepartments(String tenantKey, FeishuDepartmentListRequest request) throws FeishuApiException;

    FeishuDepartmentListPager getDeptListByParentDept(String tenantKey, String departmentId, int pageSize, boolean fetchChild);

    FeishuDepartmentDetailResponse getDepartmentDetail(String tenantKey, FeishuGetDepartmentDetailRequest request) throws FeishuApiException;

    FeishuDepartmentDetailListResponse batchGetDepartmentDetail(String tenantKey, FeishuBatchGetDepartmentDetailListRequest request) throws FeishuApiException;

    FeishuUserDetailListResponse getUserDetailList(String tenantKey, FeishuUserDetailListRequest request) throws FeishuApiException;

    FeishuUserDetailListPager getUserListByDept(String tenantKey, String departmentId, int pageSize, boolean fetchChild);

    FeishuV3DeptResponse getDept(String tenantKey, DeptIdType deptIdType);

    FeishuV3GetParentDeptsResponse getParentDepts(String tenantKey, FeishuV3GetParentDeptsRequest request);

    FeishuV3GetParentDeptsPager getParentDepts(String tenantKey, DeptIdType deptIdType);

    FeishuV3DeptsResponse getDepts(String tenantKey, FeishuV3DeptsRequest request);

    FeishuV3DeptsPager getDepts(String tenantKey, DeptIdType deptIdType);
}
