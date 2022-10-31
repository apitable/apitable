package com.vikadata.api.modular.finance.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.finance.mapper.OrderMetadataMapper;
import com.vikadata.api.modular.finance.service.IOrderMetadataService;
import com.vikadata.entity.OrderMetadataEntity;

import org.springframework.stereotype.Service;

/**
 * <p> 
 * Order Metadata Service Implement Class
 * </p>
 */
@Service
@Slf4j
public class OrderMetadataServiceImpl extends ServiceImpl<OrderMetadataMapper, OrderMetadataEntity> implements IOrderMetadataService {
}
