package com.vikadata.api.modular.finance.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.OrderPaymentEntity;

/**
 * 订阅计费系统-订单交易表 Mapper
 * @author Shawn Deng
 * @date 2022-05-13 16:34:13
 */
public interface OrderPaymentMapper extends BaseMapper<OrderPaymentEntity> {

    /**
     * 根据交易号查询
     * @param payTransactionId 交易号
     * @return EconomicOrderPaymentEntity
     */
    OrderPaymentEntity selectByTransactionId(@Param("payTransactionId") String payTransactionId);

    /**
     * 根据订单号查询
     * @param orderId 订单号
     * @return order payment list
     */
    List<OrderPaymentEntity> selectByOrderId(@Param("orderId") String orderId);
}
