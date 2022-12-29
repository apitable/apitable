package com.apitable.starter.idaas.core.api;

import com.apitable.starter.idaas.core.IdaasApiException;
import com.apitable.starter.idaas.core.IdaasTemplate;
import com.apitable.starter.idaas.core.constant.ApiUri;
import com.apitable.starter.idaas.core.model.TenantRequest;
import com.apitable.starter.idaas.core.model.TenantResponse;
import com.apitable.starter.idaas.core.model.WellKnowResponse;
import com.apitable.starter.idaas.core.support.ServiceAccount;

/**
 * <p>
 * System Manage API
 * </p>
 *
 */
public class SystemApi {

    private final IdaasTemplate idaasTemplate;
    private final String systemHost;

    public SystemApi(IdaasTemplate idaasTemplate, String systemHost) {
        this.idaasTemplate = idaasTemplate;
        this.systemHost = systemHost;
    }

    /**
     * Open the tenant, and preset the authentication source and single sign on application.
     * The authentication source or single sign on application configuration will be updated when this interface is called multiple times
     *
     * @param request request parameters
     * @param serviceAccount system ServiceAccount
     * @return tenant information
     */
    public TenantResponse tenant(TenantRequest request, ServiceAccount serviceAccount) throws IdaasApiException {
        return idaasTemplate.post(systemHost + ApiUri.TENANT, request, TenantResponse.class, null, serviceAccount, null);
    }

    /**
     * create tenant ServiceAccount
     *
     * @param tenantName tenant name to operate on
     * @param serviceAccount system ServiceAccount
     * @return tenant's ServiceAccount
     */
    public ServiceAccount serviceAccount(String tenantName, ServiceAccount serviceAccount) throws IdaasApiException {
        return idaasTemplate.post(systemHost + ApiUri.SERVICE_ACCOUNT, null, ServiceAccount.class, tenantName, serviceAccount, null);
    }

    /**
     * Get the return result of the Well known interface
     *
     * @param wellKnownUrl Well-known interface path
     * @return result
     */
    public WellKnowResponse fetchWellKnown(String wellKnownUrl) throws IdaasApiException {
        return idaasTemplate.getFromUrl(wellKnownUrl, null, WellKnowResponse.class);
    }

}
