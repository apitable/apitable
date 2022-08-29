package com.vikadata.api.util.billing;

import java.util.Map;

import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.system.config.SystemConfigManager;
import com.vikadata.system.config.billing.Price;
import com.vikadata.system.config.lark.LarkPlan;

/**
 * <p>
 * 飞书付费方案配置工具类
 * </p>
 * @author zoe zheng
 * @date 2022/2/25 14:24
 */
@Slf4j
public class LarkPlanConfigManager {

    private static final Map<String, LarkPlan> LARK_PLAN = SystemConfigManager.getConfig().getLark().getPlans();

    public static Map<String, LarkPlan> getBillingConfig() {
        return LARK_PLAN;
    }

    /**
     * 获取飞书价格方案
     *
     * @param larkPlanId 飞书订阅ID
     * @return Price
     * @author zoe zheng
     * @date 2022/5/19 17:39
     */
    public static Price getPriceByLarkPlanId(String larkPlanId) {
        LarkPlan larkPlan = LARK_PLAN.get(larkPlanId);
        if (larkPlan == null) {
            return null;
        }
        // 获取飞书方案对应的价目ID
        String billingPriceId = larkPlan.getBillingPriceId();
        if (StrUtil.isBlank(billingPriceId)) {
            return null;
        }
        // 如果是一对一的关系，直接返回对应的价目对应的订阅方案
        return BillingConfigManager.getBillingConfig().getPrices().get(billingPriceId);
    }
}
