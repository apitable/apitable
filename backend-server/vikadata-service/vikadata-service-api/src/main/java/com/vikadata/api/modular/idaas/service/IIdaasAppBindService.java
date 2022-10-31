package com.vikadata.api.modular.idaas.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.modular.idaas.model.IdaasAppBindRo;
import com.vikadata.api.modular.idaas.model.IdaasAppBindVo;
import com.vikadata.entity.IdaasAppBindEntity;

/**
 * <p>
 * IDaaS application is bound to the space
 * </p>
 */
public interface IIdaasAppBindService extends IService<IdaasAppBindEntity> {

    /**
     * Query the binding information between the application and the space station
     *
     * @param spaceId Application's Client Secret
     * @return bound information
     */
    IdaasAppBindEntity getBySpaceId(String spaceId);

    /**
     * IDaaS Bind the application under the tenant
     *
     * <p>
     * Called only for privatization deployment
     * </p>
     *
     * @param request Request parameters
     * @return Binding Results
     */
    IdaasAppBindVo bindTenantApp(IdaasAppBindRo request);

}
