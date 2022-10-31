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
