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
 * wecom plan config manager
 * </p>
 */
public class WeComPlanConfigManager {

    private static final Map<String, WeComPlan> WECOM_PLAN = SystemConfigManager.getConfig().getWecom().getPlans();

    /**
     * Determine whether the product version ID of wecom is a free trial version
     *
     * @param editionId wecom edition id
     * @return free | false
     */
    public static boolean isWeComTrialEdition(String editionId) {
        return WECOM_PLAN.get(editionId).isTrial();
    }

    /**
     * Get the subscription phase corresponding to the wecom subscription version
     *
     * @param editionId wecom edition id
     * @return SubscriptionPhase
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
     * get paid plans for wecom trials
     *
     * @return paid plan
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
     * get plan by wecom edition id
     *
     * @param editionId wecom edition id
     * @param seats seats
     * @return Plan
     */
    public static Plan getPlanByWeComEditionId(String editionId, Long seats) {
        WeComPlan weComPlan = WECOM_PLAN.get(editionId);
        List<String> billingPlanIds = Optional.ofNullable(weComPlan)
                .map(WeComPlan::getBillingPlanId)
                .orElse(null);
        if (CollUtil.isEmpty(billingPlanIds)) {
            return null;
        }
        // If there is only one subscription plan, return directly
        if (billingPlanIds.size() == 1) {
            return BillingConfigManager.getBillingConfig().getPlans().get(billingPlanIds.get(0));
        }
        // Match the corresponding subscription plan according to the number of seats
        Map<String, Plan> planMap = BillingConfigManager.getBillingConfig().getPlans();
        Plan plan = null;
        for (String billingPlanId : billingPlanIds) {
            // Match the corresponding subscription plan according to the number of users
            Plan billingPlan = planMap.get(billingPlanId);
            int billingPlanSeats = billingPlan.getSeats();
            int seatsInt = seats.intValue();
            if (Objects.equals(billingPlanSeats, seatsInt)) {
                plan = billingPlan;
                break;
            }
            else if (billingPlanSeats > seatsInt && (Objects.isNull(plan) || billingPlanSeats < plan.getSeats())) {
                // Traverse the subscription specifications with the number of people greater than and closest to the current trial number
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
