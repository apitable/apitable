package com.vikadata.api.modular.idaas.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.modular.idaas.model.IdaasTenantCreateRo;
import com.vikadata.api.modular.idaas.model.IdaasTenantCreateVo;
import com.vikadata.entity.IdaasTenantEntity;

/**
 * <p>
 * 玉符 IDaaS 租户信息
 * </p>
 * @author 刘斌华
 * @date 2022-05-17 18:05:53
 */
public interface IIdaasTenantService extends IService<IdaasTenantEntity> {

    /**
     * 创建玉符 IDaaS 租户及其默认的管理员
     *
     * <p>
     * 仅用于私有化部署时调用
     * </p>
     *
     * @param request 请求参数
     * @return 返回结果
     * @author 刘斌华
     * @date 2022-05-18 18:21:05
     */
    IdaasTenantCreateVo createTenant(IdaasTenantCreateRo request);

    /**
     * 根据租户名来查询租户信息
     *
     * @param tenantName 租户名
     * @return 租户信息
     * @author 刘斌华
     * @date 2022-05-25 15:36:16
     */
    IdaasTenantEntity getByTenantName(String tenantName);

    /**
     * 根据租户下应用所绑定的空间站来查询租户信息
     *
     * @param spaceId 绑定的空间站 ID
     * @return 租户信息
     * @author 刘斌华
     * @date 2022-05-25 15:36:16
     */
    IdaasTenantEntity getBySpaceId(String spaceId);

}
