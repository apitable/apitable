package com.vikadata.api.enterprise.social.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.SocialWecomPermitOrderEntity;

/**
 * <p>
 * WeCom Service Provider Interface License Ordering Information
 * </p>
 */
public interface ISocialWecomPermitOrderService extends IService<SocialWecomPermitOrderEntity> {

    /**
     * Get details according to the order number
     *
     * @param orderId License Order Number
     * @return Order Details
     */
    SocialWecomPermitOrderEntity getByOrderId(String orderId);

    /**
     * Query according to order status
     *
     * @param suiteId App Suite ID
     * @param authCorpId Authorized enterprise ID
     * @param orderStatuses Order status queried
     * @return List of qualified orders
     */
    List<SocialWecomPermitOrderEntity> getByOrderStatuses(String suiteId, String authCorpId, List<Integer> orderStatuses);

}
