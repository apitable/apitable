package com.vikadata.api.modular.finance.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.OrderItemEntity;

/**
 * <p>
 * Order Item Service
 * </p>
 */
public interface IOrderItemService extends IService<OrderItemEntity> {

    /**
     * Get order item by order id
     *
     * @param orderId order id
     * @return item entity list
     */
    List<OrderItemEntity> getByOrderId(String orderId);

    /**
     * Get the base product in the order item
     *
     * @param orderId order id
     * @return order item entity
     */
    OrderItemEntity getBaseProductInOrder(String orderId);

    /**
     * Get order item by subscription id
     *
     * @param subscriptionId subscription id
     * @return item entity list
     */
    List<OrderItemEntity> getBySubscriptionId(String subscriptionId);

    /**
     * Get order item by order id
     *
     * @param orderId order id
     * @return List<String>
     */
    List<String> getSubscriptionIdsByOrderId(String orderId);
}
