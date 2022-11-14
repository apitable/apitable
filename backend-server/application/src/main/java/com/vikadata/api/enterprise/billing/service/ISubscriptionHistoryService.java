package com.vikadata.api.enterprise.billing.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.enterprise.billing.enums.ChangeType;
import com.vikadata.entity.SubscriptionEntity;
import com.vikadata.entity.SubscriptionHistoryEntity;

/**
 * <p>
 * Subscription History Service
 * </p>
 */
public interface ISubscriptionHistoryService extends IService<SubscriptionHistoryEntity> {

    /**
     * save history
     *
     * @param entity        subscription
     * @param changeType    change type
     */
    void saveHistory(SubscriptionEntity entity, ChangeType changeType);

    /**
     * Batch save
     *
     * @param entities      subscriptions
     * @param changeType    change type
     */
    void saveBatchHistory(List<SubscriptionEntity> entities, ChangeType changeType);
}
