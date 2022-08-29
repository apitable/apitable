package com.vikadata.api.modular.idaas.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.modular.idaas.model.IdaasAppBindRo;
import com.vikadata.api.modular.idaas.model.IdaasAppBindVo;
import com.vikadata.entity.IdaasAppBindEntity;

/**
 * <p>
 * 玉符 IDaaS 应用与空间站绑定
 * </p>
 * @author 刘斌华
 * @date 2022-05-19 11:29:21
 */
public interface IIdaasAppBindService extends IService<IdaasAppBindEntity> {

    /**
     * 查询应用和空间站的绑定信息
     *
     * @param spaceId 应用 Client Secret
     * @return 绑定信息
     * @author 刘斌华
     * @date 2022-05-19 11:42:56
     */
    IdaasAppBindEntity getBySpaceId(String spaceId);

    /**
     * 玉符 IDaaS 绑定租户下的应用
     *
     * <p>
     * 仅用于私有化部署时调用
     * </p>
     *
     * @param request 请求参数
     * @return 绑定结果
     * @author 刘斌华
     * @date 2022-05-19 10:41:47
     */
    IdaasAppBindVo bindTenantApp(IdaasAppBindRo request);

}
