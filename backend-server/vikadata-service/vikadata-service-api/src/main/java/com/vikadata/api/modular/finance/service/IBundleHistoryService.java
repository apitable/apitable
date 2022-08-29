package com.vikadata.api.modular.finance.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.enums.audit.ChangeType;
import com.vikadata.entity.BundleEntity;
import com.vikadata.entity.BundleHistoryEntity;

/**
 * 订阅套餐历史服务
 * @author Shawn Deng
 * @date 2022-06-09 18:33:11
 */
public interface IBundleHistoryService extends IService<BundleHistoryEntity> {

    /**
     * 保存历史变更
     * @param entity bundle记录
     * @param changeType 变更类型
     */
    void saveHistory(BundleEntity entity, ChangeType changeType);

    /**
     * 批量保存
     * @param entities bundle list
     * @param changeType 变更类型
     */
    void saveBatchHistory(List<BundleEntity> entities, ChangeType changeType);
}
