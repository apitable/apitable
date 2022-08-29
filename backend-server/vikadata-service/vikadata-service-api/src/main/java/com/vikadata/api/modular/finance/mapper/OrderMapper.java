package com.vikadata.api.modular.finance.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.OrderEntity;

/**
 * 订阅计费系统-订单表 Mapper
 * @author Shawn Deng
 * @date 2022-05-13 16:29:26
 */
public interface OrderMapper extends BaseMapper<OrderEntity> {

    /**
     * 根据订单号查询
     * @param orderId 订单号
     * @return FinanceOrderEntity
     */
    OrderEntity selectByOrderId(@Param("orderId") String orderId);

    /**
     * 查询渠道订单
     * @param spaceId 空间ID
     * @param channelOrderId 渠道订单号
     * @author zoe zheng
     * @date 2022/6/7 15:36
     */
    String selectOrderBySpaceIdChannelOrderId(@Param("spaceId") String spaceId,
            @Param("channelOrderId") String channelOrderId);

    /**
     * 批量根据订单号查询
     * @param orderIds 订单号列表
     * @return FinanceOrderEntity
     */
    List<OrderEntity> selectByOrderIds(@Param("orderIds") List<String> orderIds);

    /**
     * 分页查询空间的订单
     * @param spaceId 空间ID
     * @param orderType 订单类型
     * @return page list
     */
    IPage<OrderEntity> selectBySpaceIdAndOrderType(IPage<OrderEntity> page, @Param("spaceId") String spaceId, @Param("orderType") String orderType);
}
