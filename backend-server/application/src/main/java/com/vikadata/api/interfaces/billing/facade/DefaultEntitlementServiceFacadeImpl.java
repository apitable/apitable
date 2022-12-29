package com.vikadata.api.interfaces.billing.facade;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.vikadata.api.interfaces.billing.model.DefaultSubscriptionInfo;
import com.vikadata.api.interfaces.billing.model.SubscriptionFeature;
import com.vikadata.api.interfaces.billing.model.SubscriptionInfo;

public class DefaultEntitlementServiceFacadeImpl implements EntitlementServiceFacade {

    @Override
    public SubscriptionInfo getSpaceSubscription(String spaceId) {
        return new DefaultSubscriptionInfo();
    }

    @Override
    public Map<String, SubscriptionFeature> getSpaceSubscriptions(List<String> spaceIds) {
        return spaceIds.stream().collect(Collectors.toMap(s -> s, s -> getSpaceSubscription(s).getFeature()));
    }
}
