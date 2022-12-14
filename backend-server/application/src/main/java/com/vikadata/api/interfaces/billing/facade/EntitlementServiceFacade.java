package com.vikadata.api.interfaces.billing.facade;

import java.util.List;
import java.util.Map;

import com.vikadata.api.interfaces.billing.model.EntitlementRemark;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeature;
import com.vikadata.api.interfaces.billing.model.SubscriptionInfo;

public interface EntitlementServiceFacade {

    SubscriptionInfo getSpaceSubscription(String spaceId);

    Map<String, SubscriptionFeature> getSpaceSubscriptions(List<String> spaceIds);

    default void rewardGiftCapacity(String spaceId, EntitlementRemark remark) {
        // Nothing to do default
    }
}
