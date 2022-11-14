package com.vikadata.api.enterprise.idaas.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.IdaasUserBindEntity;

/**
 * <p>
 * IDaaS User binding information
 * </p>
 */
public interface IIdaasUserBindService extends IService<IdaasUserBindEntity> {

    /**
     * Query binding information according to IDaaS user ID
     *
     * @param userId IDaaS user ID
     * @return Binding information
     */
    IdaasUserBindEntity getByUserId(String userId);

    /**
     * Query binding information according to IDaaS user ID, including deleted
     *
     * @param userIds IDaaS user ID list
     * @return Binding information, including deleted
     */
    List<IdaasUserBindEntity> getAllByUserIdsIgnoreDeleted(List<String> userIds);

    /**
     * Query binding information according to vika user ID, including deleted
     *
     * @param vikaUserIds vika user ID list
     * @return Binding information, including deleted
     */
    List<IdaasUserBindEntity> getAllByVikaUserIdsIgnoreDeleted(List<Long> vikaUserIds);

}
