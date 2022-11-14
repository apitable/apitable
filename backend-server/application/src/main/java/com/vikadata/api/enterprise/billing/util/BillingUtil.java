package com.vikadata.api.enterprise.billing.util;

import java.util.Collections;

import cn.hutool.core.util.NumberUtil;
import cn.hutool.core.util.StrUtil;

import com.vikadata.api.enterprise.billing.util.model.BillingConstants;
import com.vikadata.api.enterprise.billing.util.model.ProductChannel;
import com.vikadata.api.enterprise.billing.util.model.SubscribePlanInfo;
import com.vikadata.system.config.billing.Plan;

/**
 * billing util
 *
 * @author Shawn Deng
 */
public class BillingUtil {

    public static SubscribePlanInfo channelDefaultSubscription(ProductChannel channel) {
        Plan freePlan = BillingConfigManager.getFreePlan(channel);
        if (freePlan == null) {
            throw new RuntimeException("free plan is missing");
        }
        return SubscribePlanInfo.builder().version(BillingConstants.CATALOG_VERSION)
                .product(freePlan.getProduct())
                // lark/dingtalk/wecom base is not expired，set null
                .deadline(null)
                .basePlan(freePlan)
                .addOnPlans(Collections.emptyList()).build();
    }

    public static String legacyPlanId(String planId) {
        String[] elements = planId.split("_");
        if (elements.length < 2) {
            throw new IllegalStateException("plan parse error");
        }
        String element = elements[1];
        if (NumberUtil.isNumber(element)) {
            return StrUtil.join("_", elements[0], elements[1]);
        }
        return planId;
    }
}
