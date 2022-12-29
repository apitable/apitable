package com.vikadata.api.shared.sysconfig.lark;

import lombok.Data;

/**
 * <p>
 * Lark Billing Plan
 * </p>
 */
@Data
public class LarkPlan {
    private String id;

    private String larkPricePlanId;

    private String billingPriceId;
}
