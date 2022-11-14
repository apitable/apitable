package com.vikadata.api.enterprise.billing.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.SocialDingtalkRefundEntity;
import com.vikadata.social.dingtalk.event.order.SyncHttpMarketServiceCloseEvent;

public interface ISocialDingTalkRefundService extends IService<SocialDingtalkRefundEntity> {
    /**
     * check whether refund existed
     *
     * @param orderId  order id
     * @param tenantId tenant key
     * @param appId app id
     * @return boolean
     */
    Integer getStatusByOrderId(String tenantId, String appId, String orderId);

    /**
     * Create refund
     *
     * @param event order refund event data
     */
    void createRefund(SyncHttpMarketServiceCloseEvent event);

    /**
     * Update order status based on DingTalk order number
     *
     * @param orderId   order id
     * @param tenantId  tenant id
     * @param appId     app id
     * @param status    Order processing status 1: processed, 0 not processed
     */
    void updateTenantRefundStatusByOrderId(String tenantId, String appId, String orderId, Integer status);
}
