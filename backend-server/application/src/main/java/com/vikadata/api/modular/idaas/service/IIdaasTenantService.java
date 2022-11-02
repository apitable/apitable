package com.vikadata.api.modular.idaas.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.modular.idaas.model.IdaasTenantCreateRo;
import com.vikadata.api.modular.idaas.model.IdaasTenantCreateVo;
import com.vikadata.entity.IdaasTenantEntity;

/**
 * <p>
 * DaaS tenant information
 * </p>
 */
public interface IIdaasTenantService extends IService<IdaasTenantEntity> {

    /**
     * Create IDaaS tenant and its default administrator
     *
     * <p>
     * Called only for privatization deployment
     * </p>
     *
     * @param request Request parameters
     * @return Return Results
     */
    IdaasTenantCreateVo createTenant(IdaasTenantCreateRo request);

    /**
     * Query tenant information based on tenant name
     *
     * @param tenantName Tenant Name
     * @return Tenant information
     */
    IdaasTenantEntity getByTenantName(String tenantName);

    /**
     * Query the tenant information according to the space station bound by the application under the tenant
     *
     * @param spaceId space ID
     * @return tenant information
     */
    IdaasTenantEntity getBySpaceId(String spaceId);

}
