package com.vikadata.api.modular.finance.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.finance.mapper.OrderMetadataMapper;
import com.vikadata.api.modular.finance.service.IOrderMetadataService;
import com.vikadata.entity.OrderMetadataEntity;

import org.springframework.stereotype.Service;

/**
 * <p> 
 * 订单元数据服务
 * </p> 
 * @author zoe zheng 
 * @date 2022/5/23 17:42
 */
@Service
@Slf4j
public class OrderMetadataServiceImpl extends ServiceImpl<OrderMetadataMapper, OrderMetadataEntity> implements IOrderMetadataService {
}
