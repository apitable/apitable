package com.vikadata.api.modular.idaas.service;

import com.vikadata.api.modular.idaas.model.IdaasContactChange;

/**
 * <p>
 * IDaaS Unified handling of address book changes
 * </p>
 */
public interface IIdaasContactChangeService {

    /**
     * Agree to batch save IDaaS address book change information
     *
     * @param tenantName tenant name
     * @param spaceId space ID
     * @param contactChange Address book change information
     */
    void saveContactChange(String tenantName, String spaceId, IdaasContactChange contactChange);

}
