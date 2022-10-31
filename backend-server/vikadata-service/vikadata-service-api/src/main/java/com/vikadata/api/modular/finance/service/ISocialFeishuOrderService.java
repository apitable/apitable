package com.vikadata.api.modular.finance.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.SocialFeishuOrderEntity;
import com.vikadata.social.feishu.event.app.OrderPaidEvent;

public interface ISocialFeishuOrderService extends IService<SocialFeishuOrderEntity> {

    /**
     * check whether order existed
     *
     * @param orderId order id
     * @param tenantId tenant key
     * @param appId app id
     * @return boolean
     */
    Integer getStatusByOrderId(String tenantId, String appId, String orderId);

    /**
     * Create order
     *
     * @param event order purchase event data
     */
    void createOrder(OrderPaidEvent event);

    /**
     * Update order status based on Feishu order number
     *
     * @param orderId   order id
     * @param tenantId  tenant id
     * @param appId     app id
     * @param status    order processing status 1: processed, 0 not processed
     */
    void updateTenantOrderStatusByOrderId(String tenantId, String appId, String orderId, Integer status);

    /**
     * Get all orders under tenant app
     *
     * @param tenantId  tenant id
     * @param appId     app id
     * @return List<OrderPaidEvent>
     */
    List<String> getOrdersByTenantIdAndAppId(String tenantId, String appId);
}
