package com.apitable.mock.bean;

import com.apitable.interfaces.billing.model.DefaultSubscriptionInfo;
import com.apitable.interfaces.billing.model.SubscriptionFeature;

public class MockSubscriptionInfo extends DefaultSubscriptionInfo {

    public MockSubscriptionInfo(SubscriptionFeature feature) {
        super("CE", "ce_unlimited", feature);
    }
}
