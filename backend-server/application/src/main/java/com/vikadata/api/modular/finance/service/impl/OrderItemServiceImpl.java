package com.vikadata.api.modular.finance.service.impl;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.finance.mapper.OrderItemMapper;
import com.vikadata.api.modular.finance.service.IOrderItemService;
import com.vikadata.api.util.billing.model.ProductCategory;
import com.vikadata.entity.OrderItemEntity;

import org.springframework.stereotype.Service;

/**
 * <p>
 * Order Item Service Implement Class
 * </p>
 */
@Service
@Slf4j
public class OrderItemServiceImpl extends ServiceImpl<OrderItemMapper, OrderItemEntity> implements IOrderItemService {

    @Override
    public List<OrderItemEntity> getByOrderId(String orderId) {
        return baseMapper.selectByOrderId(orderId);
    }

    @Override
    public OrderItemEntity getBaseProductInOrder(String orderId) {
        List<OrderItemEntity> orderItemEntities = getByOrderId(orderId);
        return orderItemEntities.stream().filter(orderItem -> ProductCategory.BASE.name().equals(orderItem.getProductCategory()))
                .findFirst().orElse(null);
    }

    @Override
    public List<OrderItemEntity> getBySubscriptionId(String subscriptionId) {
        return baseMapper.selectBySubscriptionId(subscriptionId);
    }

    @Override
    public List<String> getSubscriptionIdsByOrderId(String orderId) {
        return baseMapper.selectSubscriptionIdsByOrderId(orderId);
    }
}
