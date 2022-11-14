package com.vikadata.api.enterprise.billing.util;

import java.util.Map;

import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.system.config.SystemConfigManager;
import com.vikadata.system.config.billing.Price;
import com.vikadata.system.config.lark.LarkPlan;

/**
 * <p>
 * lark plan config manager
 * </p>
 * @author zoe zheng
 */
@Slf4j
public class LarkPlanConfigManager {

    private static final Map<String, LarkPlan> LARK_PLAN = SystemConfigManager.getConfig().getLark().getPlans();

    public static Map<String, LarkPlan> getBillingConfig() {
        return LARK_PLAN;
    }

    /**
     * get price by lark plan id
     *
     * @param larkPlanId lark plan id
     * @return Price
     */
    public static Price getPriceByLarkPlanId(String larkPlanId) {
        LarkPlan larkPlan = LARK_PLAN.get(larkPlanId);
        if (larkPlan == null) {
            return null;
        }
        String billingPriceId = larkPlan.getBillingPriceId();
        if (StrUtil.isBlank(billingPriceId)) {
            return null;
        }
        return BillingConfigManager.getBillingConfig().getPrices().get(billingPriceId);
    }
}
