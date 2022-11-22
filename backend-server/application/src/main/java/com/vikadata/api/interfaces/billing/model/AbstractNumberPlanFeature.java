package com.vikadata.api.interfaces.billing.model;

public abstract class AbstractNumberPlanFeature implements PlanFeature<Long> {

    private Long value;

    public AbstractNumberPlanFeature(Long value) {
        this.value = value;
    }

    public void plus(long other) {
        value = value + other;
    }

    @Override
    public Long getValue() {
        return value;
    }
}
