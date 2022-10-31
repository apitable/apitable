package com.vikadata.system.config.wecom;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * WeCom Billing Plan
 * </p>
 */
@Setter
@Getter
public class WeComPlan {

    /**
     * product version ID
     */
    private String id;

    /**
     * list of subscription plans for which the price list applies
     */
    private List<String> billingPlanId;

    /**
     * is it a free trial version
     */
    private boolean trial;

}
