package com.vikadata.api.enterprise.billing.util.model;

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
 * plan info
 * </p>
 *
 * @author Shawn Deng
 */
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@Data
public class SubscribePlanInfo {

    private String version;

    private String product;

    @Default
    private boolean free = true;

    private LocalDate startDate;

    private LocalDate deadline;

    private Plan basePlan;

    @Default
    private boolean onTrial = false;

    private List<Plan> addOnPlans;
}
