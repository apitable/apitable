package com.vikadata.api.enterprise.idaas.service;

import com.vikadata.api.enterprise.idaas.model.IdaasAuthLoginVo;

/**
 * <p>
 * IDaaS Login authorization
 * </p>
 */
public interface IIdaasAuthService {

    /**
     * Get the address of the vika one click login page
     *
     * @param clientId IDaaS Application's Client ID
     * @return Address of vika one click login page
     */
    String getVikaLoginUrl(String clientId);

    /**
     * Get the address of vika's IDaaS login callback page
     *
     * @param clientId IDaaS Application's Client ID
     * @param spaceId Bound space ID, this field is not required for privatization deployment
     * @return vika handles the address of the IDaaS login callback page
     */
    String getVikaCallbackUrl(String clientId, String spaceId);

    /**
     * Get IDaaS login path
     *
     * @param clientId IDaaS Application's Client ID
     * @return IDaaS login path
     */
    IdaasAuthLoginVo idaasLoginUrl(String clientId);

    /**
     * IDaaS After login, callback to complete subsequent operations
     *
     * @param clientId IDaaS Application's Client ID
     * @param spaceId bound space ID, this field is not required for privatization deployment
     * @param authCode Authorization code returned by callback
     * @param state Random string returned by callback
     */
    void idaasLoginCallback(String clientId, String spaceId, String authCode, String state);

}
