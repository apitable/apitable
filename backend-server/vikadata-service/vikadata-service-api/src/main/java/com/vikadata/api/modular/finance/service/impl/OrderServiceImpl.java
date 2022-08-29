package com.vikadata.api.modular.finance.service.impl;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.eco.service.IEconomicOrderMetadataService;
import com.vikadata.api.modular.eco.service.IEconomicOrderService;
import com.vikadata.api.modular.finance.service.IOrderService;
import com.vikadata.entity.EconomicOrderEntity;
import com.vikadata.entity.EconomicOrderMetadataEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 订单服务实现
 *
 * @author Shawn Deng
 */
@Service
@Slf4j
public class OrderServiceImpl implements IOrderService {

    @Resource
    private IEconomicOrderService iEconomicOrderService;

    @Resource
    private IEconomicOrderMetadataService iEconomicOrderMetadataService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createOrderWithMetadata(EconomicOrderEntity orderEntity, EconomicOrderMetadataEntity orderMetadataEntity) {
        iEconomicOrderService.save(orderEntity);
        iEconomicOrderMetadataService.save(orderMetadataEntity);
    }
}
