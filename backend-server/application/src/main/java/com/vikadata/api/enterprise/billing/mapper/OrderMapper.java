package com.vikadata.api.enterprise.billing.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.OrderEntity;

/**
 * Subscription Billing System - Order Mapper
 */
public interface OrderMapper extends BaseMapper<OrderEntity> {

    /**
     * Query by order id
     *
     * @param orderId order id
     * @return FinanceOrderEntity
     */
    OrderEntity selectByOrderId(@Param("orderId") String orderId);

    /**
     * Query order id by space id and channel order id
     *
     * @param spaceId           space id
     * @param channelOrderId    channel order id
     */
    String selectOrderBySpaceIdChannelOrderId(@Param("spaceId") String spaceId,
            @Param("channelOrderId") String channelOrderId);

    /**
     * Batch query by oder id list
     *
     * @param orderIds order id list
     * @return FinanceOrderEntity
     */
    List<OrderEntity> selectByOrderIds(@Param("orderIds") List<String> orderIds);

    /**
     * Query space order page
     *
     * @param spaceId   space id
     * @param orderType order type
     * @return page list
     */
    IPage<OrderEntity> selectBySpaceIdAndOrderType(IPage<OrderEntity> page, @Param("spaceId") String spaceId, @Param("orderType") String orderType);
}
