package com.vikadata.api.modular.idaas.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.IdaasUserBindEntity;

/**
 * <p>
 * 玉符 IDaaS 用户绑定信息
 * </p>
 * @author 刘斌华
 * @date 2022-05-31 11:15:47
 */
public interface IIdaasUserBindService extends IService<IdaasUserBindEntity> {

    /**
     * 根据 IDaaS 用户 ID 查询绑定信息
     *
     * @param userId 玉符 IDaaS 用户 ID
     * @return 绑定信息
     * @author 刘斌华
     * @date 2022-06-05 13:35:12
     */
    IdaasUserBindEntity getByUserId(String userId);

    /**
     * 根据 IDaaS 用户 ID 查询绑定信息，包括已删除的
     *
     * @param userIds 玉符 IDaaS 用户 ID 列表
     * @return 绑定信息，包括已删除的
     * @author 刘斌华
     * @date 2022-06-04 16:05:36
     */
    List<IdaasUserBindEntity> getAllByUserIdsIgnoreDeleted(List<String> userIds);

    /**
     * 根据维格用户 ID 查询绑定信息，包括已删除的
     *
     * @param vikaUserIds 维格用户 ID 列表
     * @return 绑定信息，包括已删除的
     * @author 刘斌华
     * @date 2022-06-04 16:05:36
     */
    List<IdaasUserBindEntity> getAllByVikaUserIdsIgnoreDeleted(List<Long> vikaUserIds);

}
