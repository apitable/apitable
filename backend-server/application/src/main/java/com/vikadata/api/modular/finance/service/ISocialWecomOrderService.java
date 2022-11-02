package com.vikadata.api.modular.finance.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.SocialWecomOrderEntity;
import com.vikadata.social.wecom.event.order.WeComOrderPaidEvent;

/**
 * <p>
 * Subscription Billing System - Wecom Order Service
 * </p>
 */
public interface ISocialWecomOrderService extends IService<SocialWecomOrderEntity> {

    /**
     * Create order
     *
     * @param paidEvent paid Event order info
     * @return SocialWecomOrderEntity
     */
    SocialWecomOrderEntity createOrder(WeComOrderPaidEvent paidEvent);

    /**
     * Get order
     *
     * @param orderId order id
     * @return SocialWecomOrderEntity
     */
    SocialWecomOrderEntity getByOrderId(String orderId);

    /**
     * Get the tenant's last successful payment order
     *
     * @param suiteId       suite id
     * @param paidCorpId    paid corp id
     * @return SocialWecomOrderEntity
     */
    SocialWecomOrderEntity getLastPaidOrder(String suiteId, String paidCorpId);

    /**
     * modify order status by order id
     *
     * @param orderId social order id
     * @param orderStatus order status
     */
    void updateOrderStatusByOrderId(String orderId, int orderStatus);

    /**
     * Get the latest non-refundable subscription for the current subscription
     *
     * @param spaceId space id
     * @param suiteId suite id
     * @param paidCorpId paid corp id
     * @return subscriptionId
     */
    List<String> getUnRefundedLastSubscriptionIds(String spaceId, String suiteId, String paidCorpId);
}
