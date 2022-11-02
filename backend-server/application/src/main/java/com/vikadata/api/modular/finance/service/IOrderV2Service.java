package com.vikadata.api.modular.finance.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.enums.finance.OrderStatus;
import com.vikadata.api.enums.finance.OrderType;
import com.vikadata.api.enums.finance.PayChannel;
import com.vikadata.api.modular.finance.core.Bundle;
import com.vikadata.api.modular.finance.core.DryRunArguments;
import com.vikadata.api.modular.finance.core.OrderArguments;
import com.vikadata.api.modular.finance.core.OrderPrice;
import com.vikadata.api.modular.finance.model.OrderDetailVo;
import com.vikadata.api.modular.finance.model.OrderPaymentVo;
import com.vikadata.api.modular.finance.model.OrderPreview;
import com.vikadata.entity.OrderEntity;
import com.vikadata.system.config.billing.Price;

/**
 * <p>
 * Order Service
 * </p>
 */
public interface IOrderV2Service extends IService<OrderEntity> {

    /**
     * Get order
     *
     * @param orderId order id
     * @return entity
     */
    OrderEntity getByOrderId(String orderId);

    /**
     * Batch get order
     *
     * @param orderIds order id list
     * @return order list
     */
    List<OrderEntity> getByOrderIds(List<String> orderIds);

    /**
     * Get order detail
     *
     * @param orderId order id
     * @return OrderDetailVo
     */
    OrderDetailVo getOrderDetailByOrderId(String orderId);

    /**
     * Trial run order generation
     *
     * @param dryRunArguments arguments
     * @return OrderPreview
     */
    OrderPreview triggerDryRunOrderGeneration(DryRunArguments dryRunArguments);

    /**
     * Fix order price
     *
     * @param actionBundle space subscription bundle
     * @param newPricePlan new price plan
     * @return OrderPrice
     */
    OrderPrice repairOrderPrice(Bundle actionBundle, Price newPricePlan);

    /**
     * Parse order type based on current space station
     *
     * @param bundle            space subscription bundle
     * @param requestPricePlan  Requested payment plan
     * @return OrderType
     */
    OrderType parseOrderType(Bundle bundle, Price requestPricePlan);

    /**
     * Create order
     *
     * @param orderArguments order arguments
     * @return order id
     */
    String createOrder(OrderArguments orderArguments);

    /**
     * Create order payment
     *
     * @param userId    user id
     * @param orderId   order id
     * @param channel   pay channel
     * @return OrderPaymentVo
     */
    OrderPaymentVo createOrderPayment(Long userId, String orderId, PayChannel channel);

    /**
     * Get order status
     *
     * @param orderId order id
     * @return OrderStatus
     */
    OrderStatus getOrderStatusByOrderId(String orderId);

    /**
     * Get order id
     *
     * @param spaceId           space id
     * @param channelOrderId    channel order id
     * @return String
     */
    String getOrderIdByChannelOrderId(String spaceId, String channelOrderId);

    /**
     * Check the payment status of the refresh order
     *
     * @param orderId order id
     * @return OrderStatus
     */
    OrderStatus checkOrderStatus(String orderId);
}
