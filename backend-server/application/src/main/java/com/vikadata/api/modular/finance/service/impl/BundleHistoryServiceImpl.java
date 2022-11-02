package com.vikadata.api.modular.finance.service.impl;

import java.util.ArrayList;
import java.util.List;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import com.vikadata.api.enums.audit.ChangeType;
import com.vikadata.api.modular.finance.mapper.BundleHistoryMapper;
import com.vikadata.api.modular.finance.service.IBundleHistoryService;
import com.vikadata.entity.BundleEntity;
import com.vikadata.entity.BundleHistoryEntity;

import org.springframework.stereotype.Service;

/**
 * <p>
 * Bundle History Service Implement Class
 * </p>
 */
@Service
public class BundleHistoryServiceImpl extends ServiceImpl<BundleHistoryMapper, BundleHistoryEntity> implements IBundleHistoryService {

    @Override
    public void saveHistory(BundleEntity bundle, ChangeType changeType) {
        save(build(bundle, changeType));
    }

    @Override
    public void saveBatchHistory(List<BundleEntity> entities, ChangeType changeType) {
        List<BundleHistoryEntity> historyEntities = new ArrayList<>();
        entities.forEach(entity -> historyEntities.add(build(entity, changeType)));
        saveBatch(historyEntities);
    }

    private BundleHistoryEntity build(BundleEntity entity, ChangeType changeType) {
        BundleHistoryEntity bundleHistoryEntity = new BundleHistoryEntity();
        bundleHistoryEntity.setTargetRowId(entity.getId());
        bundleHistoryEntity.setChangeType(changeType.name());
        bundleHistoryEntity.setBundleId(entity.getBundleId());
        bundleHistoryEntity.setSpaceId(entity.getSpaceId());
        bundleHistoryEntity.setState(entity.getState());
        bundleHistoryEntity.setStartDate(entity.getStartDate());
        bundleHistoryEntity.setEndDate(entity.getEndDate());
        bundleHistoryEntity.setIsDeleted(entity.getIsDeleted());
        bundleHistoryEntity.setCreatedBy(entity.getCreatedBy());
        bundleHistoryEntity.setUpdatedBy(entity.getUpdatedBy());
        return bundleHistoryEntity;
    }
}
