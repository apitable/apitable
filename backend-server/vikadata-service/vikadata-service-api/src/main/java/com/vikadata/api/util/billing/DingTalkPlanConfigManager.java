package com.vikadata.api.util.billing;

import java.util.List;
import java.util.Map;

import cn.hutool.core.collection.CollUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.system.config.SystemConfigManager;
import com.vikadata.system.config.billing.Price;
import com.vikadata.system.config.dingtalk.DingTalkPlan;

/**
 * <p>
 * 钉钉付费方案配置工具类
 * </p>
 * @author zoe zheng
 * @date 2022/2/25 14:24
 */
@Slf4j
public class DingTalkPlanConfigManager {

    private static final Map<String, DingTalkPlan> DING_TALK_PLAN =
            SystemConfigManager.getConfig().getDingtalk().getPlans();

    public static Map<String, DingTalkPlan> getBillingConfig() {
        return DING_TALK_PLAN;
    }

    /**
     * 获取钉钉价格方案
     *
     * @param itemCode 钉钉商品码
     * @author zoe zheng
     * @date 2022/5/19 17:39
     */
    public static Price getPriceByItemCodeAndMonth(String itemCode) {
        DingTalkPlan dingTalkPlan = DING_TALK_PLAN.get(itemCode);
        if (dingTalkPlan == null) {
            return null;
        }
        // 获取商品码对应的价目ID
        List<String> billingPriceId = dingTalkPlan.getBillingPriceId();
        if (CollUtil.isEmpty(billingPriceId)) {
            return null;
        }
        return BillingConfigManager.getBillingConfig().getPrices().get(billingPriceId.get(0));
    }
}
