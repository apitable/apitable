package com.vikadata.api.enterprise.idaas.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.IdaasAppEntity;

/**
 * <p>
 * IDaaS Application information
 * </p>
 */
public interface IIdaasAppService extends IService<IdaasAppEntity> {

    /**
     * Get application information
     *
     * @param clientId Application's Client ID
     * @return Application
     */
    IdaasAppEntity getByClientId(String clientId);

}
