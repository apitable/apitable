package com.vikadata.api.util.billing.model;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.system.config.billing.Plan;

/**
 * <p>
 * 订阅方案集合
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/9/12 14:29
 */
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@Data
public class SubscribePlanInfo {

    /**
     * 目录版本
     */
    private String version;

    /**
     * 订阅等级产品
     */
    private String product;

    /**
     * 是否免费; true:免费，false:收费
     */
    @Default
    private boolean free = true;

    /**
     * 开始日期
     */
    private LocalDate startDate;

    /**
     * 订阅到期时间
     */
    private LocalDate deadline;

    /**
     * 基础订阅等级方案
     */
    private Plan basePlan;

    @Default
    private boolean onTrial = false;

    /**
     * 增值订阅等级方案
     */
    private List<Plan> addOnPlans;
}
