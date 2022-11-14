package com.vikadata.api.enterprise.billing.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.OrderPaymentEntity;

/**
 * Subscription Billing System - Order Payment Mapper
 */
public interface OrderPaymentMapper extends BaseMapper<OrderPaymentEntity> {

    /**
     * Query by payment transaction id
     *
     * @param payTransactionId payment transaction id
     * @return EconomicOrderPaymentEntity
     */
    OrderPaymentEntity selectByTransactionId(@Param("payTransactionId") String payTransactionId);

    /**
     * Query by order id
     *
     * @param orderId order id
     * @return order payment list
     */
    List<OrderPaymentEntity> selectByOrderId(@Param("orderId") String orderId);
}
