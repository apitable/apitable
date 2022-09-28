package com.vikadata.api.util.billing;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import cn.hutool.core.collection.CollUtil;

import com.vikadata.api.enums.finance.SubscriptionPhase;
import com.vikadata.api.util.billing.model.ProductChannel;
import com.vikadata.system.config.SystemConfigManager;
import com.vikadata.system.config.billing.Plan;
import com.vikadata.system.config.billing.Price;
import com.vikadata.system.config.wecom.WeComPlan;

/**
 * <p>
 * 企业微信付费方案配置工具类
 * </p>
 * @author 刘斌华
 * @date 2022-04-29 18:12:36
 */
public class WeComPlanConfigManager {

    private static final Map<String, WeComPlan> WECOM_PLAN = SystemConfigManager.getConfig().getWecom().getPlans();

    /**
     * 判断企微商品版本 ID 是否为免费试用版本
     *
     * @param editionId 企微订阅版本 ID
     * @return 是否为免费试用版本
     * @author 刘斌华
     * @date 2022-05-10 11:47:28
     */
    public static boolean isWeComTrialEdition(String editionId) {
        return WECOM_PLAN.get(editionId).isTrial();
    }

    /**
     * 获取企微订阅版本对应的订阅阶段
     *
     * @param editionId 企微订阅版本 ID
     * @return 订阅阶段
     * @author 刘斌华
     * @date 2022-08-16 15:18:16
     */
    public static SubscriptionPhase getSubscriptionPhase(String editionId) {
        if (isWeComTrialEdition(editionId)) {
            return SubscriptionPhase.TRIAL;
        }
        else {
            return SubscriptionPhase.FIXEDTERM;
        }
    }

    /**
     * 获取适用于企微试用的付费方案
     *
     * @return 适用于企微试用的付费方案
     * @author 刘斌华
     * @date 2022-05-11 12:03:36
     */
    public static Plan getPaidPlanFromWeComTrial() {
        return BillingConfigManager.getBillingConfig().getPlans()
                .values().stream()
                .filter(plan -> ProductChannel.WECOM.getName().equals(plan.getChannel()))
                .filter(Plan::isCanTrial)
                .findFirst()
                .orElse(null);
    }

    /**
     * 根据企微订阅版本和使用人数获取对应的订阅方案
     *
     * @param editionId 企微订阅版本 ID
     * @param seats 使用人数
     * @return 对应的订阅方案
     * @author 刘斌华
     * @date 2022-05-05 11:21:44
     */
    public static Plan getPlanByWeComEditionId(String editionId, Long seats) {
        // 获取企业微信对应的订阅方案
        WeComPlan weComPlan = WECOM_PLAN.get(editionId);
        List<String> billingPlanIds = Optional.ofNullable(weComPlan)
                .map(WeComPlan::getBillingPlanId)
                .orElse(null);
        if (CollUtil.isEmpty(billingPlanIds)) {
            return null;
        }
        // 如果只有一个订阅方案，则直接返回
        if (billingPlanIds.size() == 1) {
            return BillingConfigManager.getBillingConfig().getPlans().get(billingPlanIds.get(0));
        }
        // 根据使用人数匹配对应的订阅方案
        Map<String, Plan> planMap = BillingConfigManager.getBillingConfig().getPlans();
        Plan plan = null;
        for (String billingPlanId : billingPlanIds) {
            // 企微推送过来的试用人数并不是价格规格列表里的最高值，需要匹配最接近的方案
            Plan billingPlan = planMap.get(billingPlanId);
            int billingPlanSeats = billingPlan.getSeats();
            int seatsInt = seats.intValue();
            if (Objects.equals(billingPlanSeats, seatsInt)) {
                // 如果人数相同直接返回
                plan = billingPlan;
                break;
            }
            else if (billingPlanSeats > seatsInt && (Objects.isNull(plan) || billingPlanSeats < plan.getSeats())) {
                // 遍历取人数大于且最接近当前试用人数的订阅规格
                plan = billingPlan;
            }
        }
        return plan;
    }

    /**
     * Get paid price
     *
     * @param editionId Wecom paid edition ID
     * @param seats Number of user
     * @param month Number of subscribe months, null while trial
     * @return Related paid price
     * @author Codeman
     * @date 2022-08-16 15:14:25
     */
    public static Price getPriceByWeComEditionIdAndMonth(String editionId, Long seats, Integer month) {
        // 1 get related plan
        Plan plan = getPlanByWeComEditionId(editionId, seats);
        if (Objects.isNull(plan)) {
            return null;
        }
        // 2 if month is null and plan is trial, then return the price with the lowest month
        if (Objects.isNull(month)) {
            if (plan.isCanTrial()) {
                return BillingConfigManager.getBillingConfig().getPrices().values().stream()
                        .filter(price -> plan.getId().equals(price.getPlanId()))
                        .min(Comparator.comparing(Price::getMonth))
                        .orElse(null);
            } else {
                return null;
            }
        }
        // 3 get price with actual month
        return BillingConfigManager.getBillingConfig().getPrices().values().stream()
                .filter(price -> plan.getId().equals(price.getPlanId()) && month.equals(price.getMonth()))
                .findFirst()
                .orElse(null);
    }

}
