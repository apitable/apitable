package com.vikadata.social.feishu.api.impl;

import com.vikadata.social.feishu.AbstractFeishuOperations;
import com.vikadata.social.feishu.api.DepartmentOperations;
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
import com.vikadata.social.feishu.model.v3.FeishuV3DeptRequest;
import com.vikadata.social.feishu.model.v3.FeishuV3DeptResponse;
import com.vikadata.social.feishu.model.v3.FeishuV3DeptsPager;
import com.vikadata.social.feishu.model.v3.FeishuV3DeptsRequest;
import com.vikadata.social.feishu.model.v3.FeishuV3DeptsResponse;
import com.vikadata.social.feishu.model.v3.FeishuV3GetParentDeptsPager;
import com.vikadata.social.feishu.model.v3.FeishuV3GetParentDeptsRequest;
import com.vikadata.social.feishu.model.v3.FeishuV3GetParentDeptsResponse;

/**
 * Feishu Department Management Interface Implementation
 */
public class DepartmentTemplate extends AbstractFeishuOperations implements DepartmentOperations {

    private static final String GET_SUB_DEPARTMENT_LIST_URL = "/contact/v1/department/simple/list";

    private static final String GET_DEPARTMENT_USER_DETAIL_LIST_URL = "/contact/v1/department/user/detail/list";

    private static final String GET_DEPARTMENT_INFO_URL = "/contact/v1/department/info/get";

    private static final String BATCH_GET_DEPARTMENT_INFO_URL = "/contact/v1/department/detail/batch_get";

    private static final String V3_GET_DEPARTMENT = "/contact/v3/departments/%s";

    private static final String V3_GET_DEPARTMENTS = "/contact/v3/departments";

    private static final String V3_GET_PARENT_DEPARTMENT = "/contact/v3/departments/parent";

    public DepartmentTemplate(FeishuTemplate feishuTemplate) {
        super(feishuTemplate);
    }

    @Override
    public FeishuDepartmentListResponse getSubDepartments(String tenantKey, FeishuDepartmentListRequest request) throws FeishuApiException {
        return getFeishuTemplate().doGet(buildUrlWithVariables(buildUri(GET_SUB_DEPARTMENT_LIST_URL), request), createAuthHeaders(getFeishuTemplate().getTenantAccessToken(tenantKey, false)), FeishuDepartmentListResponse.class);
    }

    @Override
    public FeishuDepartmentListPager getDeptListByParentDept(String tenantKey, String departmentId, int pageSize, boolean fetchChild) {
        return new FeishuDepartmentListPager(this, tenantKey, departmentId, pageSize, fetchChild);
    }

    @Override
    public FeishuDepartmentDetailResponse getDepartmentDetail(String tenantKey, FeishuGetDepartmentDetailRequest request) throws FeishuApiException {
        return getFeishuTemplate().doGet(buildUrlWithVariables(buildUri(GET_DEPARTMENT_INFO_URL), request), createAuthHeaders(getFeishuTemplate().getTenantAccessToken(tenantKey, false)), FeishuDepartmentDetailResponse.class);
    }

    @Override
    public FeishuDepartmentDetailListResponse batchGetDepartmentDetail(String tenantKey, FeishuBatchGetDepartmentDetailListRequest request) throws FeishuApiException {
        return getFeishuTemplate().doGet(buildUrlWithVariables(buildUri(BATCH_GET_DEPARTMENT_INFO_URL), request), createAuthHeaders(getFeishuTemplate().getTenantAccessToken(tenantKey, false)), FeishuDepartmentDetailListResponse.class);
    }

    @Override
    public FeishuUserDetailListResponse getUserDetailList(String tenantKey, FeishuUserDetailListRequest request) throws FeishuApiException {
        return getFeishuTemplate().doGet(buildUrlWithVariables(buildUri(GET_DEPARTMENT_USER_DETAIL_LIST_URL), request), createAuthHeaders(getFeishuTemplate().getTenantAccessToken(tenantKey, false)), FeishuUserDetailListResponse.class);
    }

    @Override
    public FeishuUserDetailListPager getUserListByDept(String tenantKey, String departmentId, int pageSize, boolean fetchChild) {
        return new FeishuUserDetailListPager(this, tenantKey, departmentId, pageSize, fetchChild);
    }

    @Override
    public FeishuV3DeptResponse getDept(String tenantKey, DeptIdType deptIdType) {
        FeishuV3DeptRequest request = new FeishuV3DeptRequest();
        request.setDepartmentIdType(deptIdType.type());
        return getFeishuTemplate().doGet(buildUrlWithVariables(buildUri(String.format(V3_GET_DEPARTMENT, deptIdType.value())), request), createAuthHeaders(getFeishuTemplate().getTenantAccessToken(tenantKey, false)), FeishuV3DeptResponse.class);
    }

    @Override
    public FeishuV3GetParentDeptsResponse getParentDepts(String tenantKey, FeishuV3GetParentDeptsRequest request) {
        return getFeishuTemplate().doGet(buildUrlWithVariables(buildUri(V3_GET_PARENT_DEPARTMENT), request), createAuthHeaders(getFeishuTemplate().getTenantAccessToken(tenantKey, false)), FeishuV3GetParentDeptsResponse.class);
    }

    @Override
    public FeishuV3GetParentDeptsPager getParentDepts(String tenantKey, DeptIdType deptIdType) {
        return new FeishuV3GetParentDeptsPager(this, tenantKey, deptIdType);
    }

    @Override
    public FeishuV3DeptsResponse getDepts(String tenantKey, FeishuV3DeptsRequest request) {
        return getFeishuTemplate().doGet(buildUrlWithVariables(buildUri(V3_GET_DEPARTMENTS), request), createAuthHeaders(getFeishuTemplate().getTenantAccessToken(tenantKey, false)), FeishuV3DeptsResponse.class);
    }

    @Override
    public FeishuV3DeptsPager getDepts(String tenantKey, DeptIdType deptIdType) {
        return new FeishuV3DeptsPager(this, tenantKey, deptIdType);
    }
}
