package com.vikadata.api.modular.finance.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.OrderItemEntity;

/**
 * 订单项目服务
 * @author Shawn Deng
 * @date 2022-05-16 16:13:25
 */
public interface IOrderItemService extends IService<OrderItemEntity> {

    /**
     * 获取订单项目
     * @param orderId 订单号
     * @return item entity list
     */
    List<OrderItemEntity> getByOrderId(String orderId);

    /**
     * 获取订单条目里的基础产品
     * @param orderId 订单号
     * @return order item entity
     */
    OrderItemEntity getBaseProductInOrder(String orderId);

    /**
     * 根据生效的订阅条目获取订单条目
     * @param subscriptionId 订阅条目ID
     * @return item entity list
     */
    List<OrderItemEntity> getBySubscriptionId(String subscriptionId);

    /**
     * 根据订单号获取订阅条目ID
     * @param orderId 订单号
     * @return List<String>
     * @author zoe zheng
     * @date 2022/5/31 17:11
     */
    List<String> getSubscriptionIdsByOrderId(String orderId);
}
