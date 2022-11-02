package com.vikadata.api.modular.finance.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.modular.finance.model.PingChargeSuccess;
import com.vikadata.entity.OrderPaymentEntity;

/**
 * <p>
 * Order Payment Service
 * </p>
 */
public interface IOrderPaymentService extends IService<OrderPaymentEntity> {

    /**
     * Get order payment by pay transaction id
     *
     * @param payTransactionId pay transaction id
     * @return FinanceOrderPaymentEntity
     */
    OrderPaymentEntity getByPayTransactionId(String payTransactionId);

    /**
     * Get order payment list by order id
     *
     * @param orderId order id
     * @return order payment list
     */
    List<OrderPaymentEntity> getByOrderId(String orderId);

    /**
     * Payment success callback notification event processing
     *
     * @param chargeSuccess payment success event notification
     * @return orderId
     */
    String retrieveOrderPaidEvent(PingChargeSuccess chargeSuccess);
}
