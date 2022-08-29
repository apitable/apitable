package com.vikadata.api.modular.finance.service;

import com.vikadata.entity.EconomicOrderEntity;
import com.vikadata.entity.EconomicOrderMetadataEntity;

/**
 * 订单服务实现
 * @author Shawn Deng
 * @date 2022-02-16 11:15:08
 */
public interface IOrderService {

    /**
     * 创建订单
     * @param orderEntity 订单实体
     * @param orderMetadataEntity 订单自定义k-v
     * @author zoe zheng
     * @date 2022/2/27 13:22
     */
    void createOrderWithMetadata(EconomicOrderEntity orderEntity, EconomicOrderMetadataEntity orderMetadataEntity);
}
