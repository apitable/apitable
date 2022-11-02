package com.vikadata.api.modular.finance.service;

import com.vikadata.api.modular.developer.model.CreateBusinessOrderRo;
import com.vikadata.api.modular.developer.model.CreateEntitlementWithAddOn;
import com.vikadata.api.modular.finance.model.OfflineOrderInfo;
import com.vikadata.api.modular.finance.model.SpaceSubscriptionVo;

/**
 * <p>
 * Financial Service
 * </p>
 */
public interface IBillingOfflineService {

    /**
     * Get a subscription to a space
     *
     * @param spaceId space id
     * @return SpaceSubscriptionVo
     */
    SpaceSubscriptionVo getSpaceSubscription(String spaceId);

    /**
     * Create a business order
     *
     * @param data request data
     * @return Message
     */
    OfflineOrderInfo createBusinessOrder(CreateBusinessOrderRo data);

    /**
     * Create a subscription with add-on plans
     *
     * @param data request data
     */
    void createSubscriptionWithAddOn(CreateEntitlementWithAddOn data);

    /**
     * Create a subscription that gives away attachment capacity with an add-on subscription plan
     *
     * @param userId   user id
     * @param userName user id
     * @param spaceId  space id
     */
    void createGiftCapacityOrder(Long userId, String userName, String spaceId);
}
