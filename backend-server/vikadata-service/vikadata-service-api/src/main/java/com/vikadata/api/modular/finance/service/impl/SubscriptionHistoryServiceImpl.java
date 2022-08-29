package com.vikadata.api.modular.finance.service.impl;

import java.util.ArrayList;
import java.util.List;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import com.vikadata.api.enums.audit.ChangeType;
import com.vikadata.api.modular.finance.mapper.SubscriptionHistoryMapper;
import com.vikadata.api.modular.finance.service.ISubscriptionHistoryService;
import com.vikadata.entity.SubscriptionEntity;
import com.vikadata.entity.SubscriptionHistoryEntity;

import org.springframework.stereotype.Service;

/**
 *
 * @author Shawn Deng
 * @date 2022-06-13 00:08:59
 */
@Service
public class SubscriptionHistoryServiceImpl extends ServiceImpl<SubscriptionHistoryMapper, SubscriptionHistoryEntity> implements ISubscriptionHistoryService {

    @Override
    public void saveHistory(SubscriptionEntity entity, ChangeType changeType) {
        save(build(entity, changeType));
    }

    @Override
    public void saveBatchHistory(List<SubscriptionEntity> entities, ChangeType changeType) {
        List<SubscriptionHistoryEntity> historyEntities = new ArrayList<>();
        entities.forEach(entity -> historyEntities.add(build(entity, changeType)));
        saveBatch(historyEntities);
    }

    private SubscriptionHistoryEntity build(SubscriptionEntity entity, ChangeType changeType) {
        SubscriptionHistoryEntity subscriptionHistoryEntity = new SubscriptionHistoryEntity();
        subscriptionHistoryEntity.setTargetRowId(entity.getId());
        subscriptionHistoryEntity.setChangeType(changeType.name());
        subscriptionHistoryEntity.setSpaceId(entity.getSpaceId());
        subscriptionHistoryEntity.setBundleId(entity.getBundleId());
        subscriptionHistoryEntity.setSubscriptionId(entity.getSubscriptionId());
        subscriptionHistoryEntity.setProductName(entity.getProductName());
        subscriptionHistoryEntity.setProductCategory(entity.getProductCategory());
        subscriptionHistoryEntity.setPlanId(entity.getPlanId());
        subscriptionHistoryEntity.setState(entity.getState());
        subscriptionHistoryEntity.setPhase(entity.getPhase());
        subscriptionHistoryEntity.setBundleStartDate(entity.getBundleStartDate());
        subscriptionHistoryEntity.setStartDate(entity.getStartDate());
        subscriptionHistoryEntity.setExpireDate(entity.getExpireDate());
        subscriptionHistoryEntity.setIsDeleted(entity.getIsDeleted());
        subscriptionHistoryEntity.setCreatedBy(entity.getCreatedBy());
        subscriptionHistoryEntity.setUpdatedBy(entity.getUpdatedBy());
        return subscriptionHistoryEntity;
    }
}
