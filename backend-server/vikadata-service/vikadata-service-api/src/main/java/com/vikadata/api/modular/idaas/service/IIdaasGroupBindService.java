package com.vikadata.api.modular.idaas.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.IdaasGroupBindEntity;

/**
 * <p>
 * 玉符 IDaaS 用户组绑定信息
 * </p>
 * @author 刘斌华
 * @date 2022-05-30 10:06:37
 */
public interface IIdaasGroupBindService extends IService<IdaasGroupBindEntity> {

    /**
     * 获取跟空间站绑定的所有用户组
     *
     * @param spaceId 要查询的空间站 ID
     * @return 空间站绑定的所有用户组
     * @author 刘斌华
     * @date 2022-05-30 11:41:43
     */
    List<IdaasGroupBindEntity> getAllBySpaceId(String spaceId);

    /**
     * 获取跟空间站绑定的所有用户组，包括已删除的
     *
     * @param spaceId 要查询的空间站 ID
     * @return 空间站绑定的所有用户组
     * @author 刘斌华
     * @date 2022-05-30 11:41:43
     */
    List<IdaasGroupBindEntity> getAllBySpaceIdIgnoreDeleted(String spaceId);

}
