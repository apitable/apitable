package com.vikadata.api.enterprise.billing.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.enterprise.billing.enums.ChangeType;
import com.vikadata.entity.BundleEntity;
import com.vikadata.entity.BundleHistoryEntity;

/**
 * <p>
 * Bundle History Service
 * </p>
 */
public interface IBundleHistoryService extends IService<BundleHistoryEntity> {

    /**
     * Save history
     *
     * @param entity        bundle entity
     * @param changeType    change type
     */
    void saveHistory(BundleEntity entity, ChangeType changeType);

    /**
     * Batch save history
     *
     * @param entities      bundle entities
     * @param changeType    change type
     */
    void saveBatchHistory(List<BundleEntity> entities, ChangeType changeType);
}
