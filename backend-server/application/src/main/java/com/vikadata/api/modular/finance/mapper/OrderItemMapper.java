package com.vikadata.api.modular.finance.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.OrderItemEntity;

/**
 * Subscription Billing System - Order Item Mapper
 */
public interface OrderItemMapper extends BaseMapper<OrderItemEntity> {

    /**
     * Query order item by order id
     *
     * @param orderId order id
     * @return order item list
     */
    List<OrderItemEntity> selectByOrderId(@Param("orderId") String orderId);

    /**
     * Query order item by subscription id
     *
     * @param subscriptionId subscription id
     * @return order item list
     */
    List<OrderItemEntity> selectBySubscriptionId(@Param("subscriptionId") String subscriptionId);

    /**
     * Query subscription id by order id
     *
     * @param orderId order id
     * @return List<String>
     */
    List<String> selectSubscriptionIdsByOrderId(@Param("orderId") String orderId);
}
