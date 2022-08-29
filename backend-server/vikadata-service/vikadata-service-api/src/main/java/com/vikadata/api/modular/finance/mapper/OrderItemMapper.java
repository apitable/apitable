package com.vikadata.api.modular.finance.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.OrderItemEntity;

/**
 * 订阅计费系统-订单项目表 Mapper
 * @author Shawn Deng
 * @date 2022-05-13 16:32:11
 */
public interface OrderItemMapper extends BaseMapper<OrderItemEntity> {

    /**
     * 查询订单项目
     * @param orderId 订单号
     * @return order item list
     */
    List<OrderItemEntity> selectByOrderId(@Param("orderId") String orderId);

    /**
     * 根据订阅条目标识查询订单项目
     * @param subscriptionId 订阅条目标识
     * @return order item list
     */
    List<OrderItemEntity> selectBySubscriptionId(@Param("subscriptionId") String subscriptionId);

    /**
     * 根据订单号获取订阅条目ID
     * @param orderId 订单号
     * @return List<String>
     * @author zoe zheng
     * @date 2022/5/31 17:11
     */
    List<String> selectSubscriptionIdsByOrderId(@Param("orderId") String orderId);
}
