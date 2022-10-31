package com.vikadata.api.modular.idaas.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.IdaasGroupBindEntity;

/**
 * <p>
 * IDaaS User group binding information
 * </p>
 */
public interface IIdaasGroupBindService extends IService<IdaasGroupBindEntity> {

    /**
     * Get all user groups bound to the space station
     *
     * @param spaceId space ID
     * @return All user groups bound to the space station
     */
    List<IdaasGroupBindEntity> getAllBySpaceId(String spaceId);

    /**
     * Get all user groups bound to the space station, including the deleted
     *
     * @param spaceId space ID
     * @return All user groups bound to the space station
     */
    List<IdaasGroupBindEntity> getAllBySpaceIdIgnoreDeleted(String spaceId);

}
