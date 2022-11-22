package com.vikadata.api.interfaces.billing.model;

public abstract class AbstractBooleanPlanFeature implements PlanFeature<Boolean> {

    private final boolean value;

    public AbstractBooleanPlanFeature(boolean value) {
        this.value = value;
    }

    @Override
    public Boolean getValue() {
        return value;
    }
}
