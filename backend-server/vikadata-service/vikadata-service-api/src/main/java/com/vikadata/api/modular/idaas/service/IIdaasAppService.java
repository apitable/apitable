package com.vikadata.api.modular.idaas.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.IdaasAppEntity;

/**
 * <p>
 * 玉符 IDaaS 应用信息
 * </p>
 * @author 刘斌华
 * @date 2022-05-25 11:40:24
 */
public interface IIdaasAppService extends IService<IdaasAppEntity> {

    /**
     * 获取应用信息
     *
     * @param clientId 应用的 Client ID
     * @return 应用信息
     * @author 刘斌华
     * @date 2022-05-25 11:51:23
     */
    IdaasAppEntity getByClientId(String clientId);

}
