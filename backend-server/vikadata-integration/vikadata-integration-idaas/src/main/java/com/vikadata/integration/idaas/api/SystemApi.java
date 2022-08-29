package com.vikadata.integration.idaas.api;

import com.vikadata.integration.idaas.IdaasApiException;
import com.vikadata.integration.idaas.IdaasTemplate;
import com.vikadata.integration.idaas.constant.ApiUri;
import com.vikadata.integration.idaas.model.TenantRequest;
import com.vikadata.integration.idaas.model.TenantResponse;
import com.vikadata.integration.idaas.model.WellKnowResponse;
import com.vikadata.integration.idaas.support.ServiceAccount;

/**
 * <p>
 * 系统管理 API
 * </p>
 * @author 刘斌华
 * @date 2022-05-12 17:42:27
 */
public class SystemApi {

    private final IdaasTemplate idaasTemplate;
    private final String systemHost;

    public SystemApi(IdaasTemplate idaasTemplate, String systemHost) {
        this.idaasTemplate = idaasTemplate;
        this.systemHost = systemHost;
    }

    /**
     * 开通租户，并预置认证源与单点登录应用。多次调用此接口，认证源或单点登录应用配置，会进行更新
     *
     * @param request 请求参数
     * @param serviceAccount 系统级 ServiceAccount
     * @return 返回结果
     * @author 刘斌华
     * @date 2022-05-12 19:04:16
     */
    public TenantResponse tenant(TenantRequest request, ServiceAccount serviceAccount) throws IdaasApiException {
        return idaasTemplate.post(systemHost + ApiUri.TENANT, request, TenantResponse.class, null, serviceAccount, null);
    }

    /**
     * 生成租户 ServiceAccount
     *
     * @param tenantName 要操作的租户名
     * @param serviceAccount 系统级 ServiceAccount
     * @return 租户的 ServiceAccount
     * @author 刘斌华
     * @date 2022-05-18 19:13:12
     */
    public ServiceAccount serviceAccount(String tenantName, ServiceAccount serviceAccount) throws IdaasApiException {
        return idaasTemplate.post(systemHost + ApiUri.SERVICE_ACCOUNT, null, ServiceAccount.class, tenantName, serviceAccount, null);
    }

    /**
     * 获取 Well-known 接口的返回结果
     *
     * @param wellKnownUrl Well-known 接口路径
     * @return 返回结果
     * @author 刘斌华
     * @date 2022-05-23 17:01:07
     */
    public WellKnowResponse fetchWellKnown(String wellKnownUrl) throws IdaasApiException {
        return idaasTemplate.getFromUrl(wellKnownUrl, null, WellKnowResponse.class);
    }

}
