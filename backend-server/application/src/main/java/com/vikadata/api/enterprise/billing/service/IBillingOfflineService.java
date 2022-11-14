package com.vikadata.api.enterprise.billing.service;

import com.vikadata.api.enterprise.gm.model.CreateBusinessOrderRo;
import com.vikadata.api.enterprise.gm.model.CreateEntitlementWithAddOn;
import com.vikadata.api.enterprise.billing.model.OfflineOrderInfo;
import com.vikadata.api.enterprise.billing.model.SpaceSubscriptionVo;

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
