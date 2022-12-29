package com.vikadata.api.interfaces.billing.model;

import java.time.LocalDate;
import java.util.List;

import com.vikadata.api.interfaces.billing.model.SubscriptionFeatures.ConsumeFeatures.CapacitySize;

import static java.util.Collections.emptyList;

public interface SubscriptionInfo {

    default String getVersion() {
        return "V1";
    };

    String getProduct();

    boolean isFree();

    boolean onTrial();

    String getBasePlan();

    default List<String> getAddOnPlans() {
        return emptyList();
    }

    default LocalDate getStartDate() {
        return null;
    }

    default LocalDate getEndDate() {
        return null;
    }

    SubscriptionFeature getFeature();

    default CapacitySize getGiftCapacity() {
        return new CapacitySize(0L);
    }

    default CapacitySize getTotalCapacity() {
        return new CapacitySize(getFeature().getCapacitySize().getValue() + getGiftCapacity().getValue());
    }
}
