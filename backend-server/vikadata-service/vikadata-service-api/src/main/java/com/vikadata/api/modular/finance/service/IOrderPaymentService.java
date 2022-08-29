package com.vikadata.api.modular.finance.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.modular.finance.model.PingChargeSuccess;
import com.vikadata.entity.OrderPaymentEntity;

/**
 * 支付订单服务
 * @author Shawn Deng
 * @date 2022-05-16 17:54:12
 */
public interface IOrderPaymentService extends IService<OrderPaymentEntity> {

    /**
     * 根据支付交易号查询
     * @param payTransactionId 支付交易号
     * @return FinanceOrderPaymentEntity
     */
    OrderPaymentEntity getByPayTransactionId(String payTransactionId);

    /**
     * 根据订单号获取支付订单列表
     * @param orderId 订单号
     * @return order payment list
     */
    List<OrderPaymentEntity> getByOrderId(String orderId);

    /**
     * 支付成功回调通知事件处理
     *
     * @param chargeSuccess 支付成功事件通知
     * @return orderId
     */
    String retrieveOrderPaidEvent(PingChargeSuccess chargeSuccess);
}
