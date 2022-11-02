package com.vikadata.api.modular.finance.core;

import com.vikadata.api.enums.finance.DryRunAction;
import com.vikadata.api.enums.finance.DryRunType;
import com.vikadata.api.modular.finance.model.DryRunOrderArgs;


/**
 * Dry Run Argument
 */
public class DryRunArguments {

    private final DryRunType dryRunType;

    private final DryRunAction action;

    private final String spaceId;

    private final String product;

    private final Integer seat;

    private final Integer month;

    public DryRunArguments(DryRunType dryRunType, DryRunAction action, String spaceId, String product, Integer seat, Integer month) {
        this.dryRunType = dryRunType;
        this.action = action;
        this.spaceId = spaceId;
        this.product = product;
        this.seat = seat;
        this.month = month;
    }

    public DryRunArguments(DryRunOrderArgs input) {
        this.dryRunType = input.getDryRunType() == null ? DryRunType.SUBSCRIPTION_ACTION : DryRunType.valueOf(input.getDryRunType());
        this.action = DryRunAction.valueOf(input.getAction());
        this.spaceId = input.getSpaceId();
        this.product = input.getProduct();
        this.seat = input.getSeat();
        this.month = input.getMonth();
    }

    public DryRunType getDryRunType() {
        return dryRunType;
    }

    public DryRunAction getAction() {
        return action;
    }

    public String getSpaceId() {
        return spaceId;
    }

    public String getProduct() {
        return product;
    }

    public Integer getSeat() {
        return seat;
    }

    public Integer getMonth() {
        return month;
    }
}
