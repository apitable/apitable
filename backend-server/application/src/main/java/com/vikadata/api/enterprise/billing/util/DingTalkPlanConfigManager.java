package com.vikadata.api.enterprise.billing.util;

import java.util.List;
import java.util.Map;

import cn.hutool.core.collection.CollUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.system.config.SystemConfigManager;
import com.vikadata.system.config.billing.Price;
import com.vikadata.system.config.dingtalk.DingTalkPlan;

/**
 * <p>
 * dingtalk plan config manager
 * </p>
 * @author zoe zheng
 */
@Slf4j
public class DingTalkPlanConfigManager {

    private static final Map<String, DingTalkPlan> DING_TALK_PLAN =
            SystemConfigManager.getConfig().getDingtalk().getPlans();

    public static Map<String, DingTalkPlan> getBillingConfig() {
        return DING_TALK_PLAN;
    }

    /**
     * get dingtalk price plan
     *
     * @param itemCode dingtalk item code
     */
    public static Price getPriceByItemCodeAndMonth(String itemCode) {
        DingTalkPlan dingTalkPlan = DING_TALK_PLAN.get(itemCode);
        if (dingTalkPlan == null) {
            return null;
        }
        // get price
        List<String> billingPriceId = dingTalkPlan.getBillingPriceId();
        if (CollUtil.isEmpty(billingPriceId)) {
            return null;
        }
        return BillingConfigManager.getBillingConfig().getPrices().get(billingPriceId.get(0));
    }
}
