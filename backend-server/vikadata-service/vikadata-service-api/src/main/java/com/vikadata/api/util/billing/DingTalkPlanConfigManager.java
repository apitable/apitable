package com.vikadata.api.util.billing;

import java.util.List;
import java.util.Map;
import java.util.Objects;

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
     * @param month 订阅时常
     * @author zoe zheng
     * @date 2022/5/19 17:39
     */
    public static Price getPriceByItemCodeAndMonth(String itemCode, Integer month) {
        DingTalkPlan dingTalkPlan = DING_TALK_PLAN.get(itemCode);
        if (dingTalkPlan == null) {
            return null;
        }
        // 获取商品码对应的价目ID
        List<String> billingPriceId = dingTalkPlan.getBillingPriceId();
        if (CollUtil.isEmpty(billingPriceId)) {
            return null;
        }
        // 如果是一对一的关系，直接返回对应的价目对应的订阅方案
        if (billingPriceId.size() == 1) {
            return BillingConfigManager.getBillingConfig().getPrices().get(billingPriceId.get(0));
        }

        // 获取价目表
        Map<String, Price> prices = BillingConfigManager.getBillingConfig().getPrices();
        for (String priceId : billingPriceId) {
            Price price = prices.get(priceId);
            // 如果 月份相同直接返回
            if (Objects.equals(month, price.getMonth())) {
                return price;
            }
        }
        return null;
    }
}
