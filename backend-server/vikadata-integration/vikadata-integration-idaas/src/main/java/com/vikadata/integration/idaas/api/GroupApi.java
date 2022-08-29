package com.vikadata.integration.idaas.api;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.util.StrUtil;

import com.vikadata.integration.idaas.IdaasApiException;
import com.vikadata.integration.idaas.IdaasTemplate;
import com.vikadata.integration.idaas.constant.ApiUri;
import com.vikadata.integration.idaas.model.AppGroupsRequest;
import com.vikadata.integration.idaas.model.AppGroupsResponse;
import com.vikadata.integration.idaas.model.GroupsRequest;
import com.vikadata.integration.idaas.model.GroupsResponse;
import com.vikadata.integration.idaas.support.ServiceAccount;

import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

/**
 * <p>
 * 用户组 API
 * </p>
 * @author 刘斌华
 * @date 2022-05-13 17:26:34
 */
public class GroupApi {

    private final IdaasTemplate idaasTemplate;
    private final String contactHost;

    public GroupApi(IdaasTemplate idaasTemplate, String contactHost) {
        this.idaasTemplate = idaasTemplate;
        this.contactHost = contactHost;
    }

    /**
     * 获取用户组列表
     *
     * @param request 请求参数
     * @param serviceAccount 租户 ServiceAccount
     * @param tenantName 租户名
     * @return 返回结果
     * @author 刘斌华
     * @date 2022-05-13 17:33:57
     */
    public GroupsResponse groups(GroupsRequest request, ServiceAccount serviceAccount, String tenantName) throws IdaasApiException {
        MultiValueMap<String, Object> multiValueMap = new LinkedMultiValueMap<>();
        multiValueMap.set("page_index", request.getPageIndex());
        multiValueMap.set("page_size", request.getPageSize());
        if (CollUtil.isNotEmpty(request.getOrderBy())) {
            multiValueMap.addAll("order_by", request.getOrderBy());
        }

        return idaasTemplate.get(contactHost + ApiUri.GROUPS, multiValueMap, GroupsResponse.class, tenantName, serviceAccount, null);
    }

    /**
     * 获取应用下的用户组列表
     *
     * @param request 请求参数
     * @param serviceAccount 租户 ServiceAccount
     * @param tenantId 租户 ID
     * @param tenantName 租户名
     * @param clientId 应用 ID
     * @return 返回结果
     * @author 刘斌华
     * @date 2022-06-14 17:13:45
     */
    public AppGroupsResponse appGroups(AppGroupsRequest request, ServiceAccount serviceAccount,
            String tenantId, String tenantName, String clientId) throws IdaasApiException {
        MultiValueMap<String, Object> multiValueMap = new LinkedMultiValueMap<>();
        multiValueMap.set("page_index", request.getPageIndex());
        multiValueMap.set("page_size", request.getPageSize());
        if (CollUtil.isNotEmpty(request.getOrderBy())) {
            multiValueMap.addAll("order_by", request.getOrderBy());
        }

        Dict variables = Dict.create()
                .set("tenantId", tenantId)
                .set("clientId", clientId);
        String appGroupUri = StrUtil.format(ApiUri.APP_GROUPS, variables);

        return idaasTemplate.get(contactHost + appGroupUri, multiValueMap, AppGroupsResponse.class, tenantName, serviceAccount, null);
    }

}
