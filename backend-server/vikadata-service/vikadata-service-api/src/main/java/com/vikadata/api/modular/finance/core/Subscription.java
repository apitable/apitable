package com.vikadata.api.modular.finance.core;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

import com.vikadata.api.enums.finance.SubscriptionPhase;
import com.vikadata.api.enums.finance.SubscriptionState;
import com.vikadata.api.util.billing.model.ProductCategory;

/**
 * 订阅捆绑包里订阅条目
 * @author Shawn Deng
 * @date 2022-05-17 17:38:43
 */
@Data
@Builder
public class Subscription {

    /**
     * 空间ID
     */
    private String spaceId;

    /**
     * 订阅捆绑包标识
     */
    private String bundleId;

    /**
     * 条目标识
     */
    private String subscriptionId;

    /**
     * 产品名称
     */
    private String productName;

    /**
     * 产品类型
     */
    private ProductCategory productCategory;

    /**
     * 产品方案
     */
    private String planId;

    /**
     * 订阅状态
     */
    private SubscriptionState state;

    /**
     * 开始时间
     */
    private LocalDateTime startDate;

    /**
     * 结束时间
     */
    private LocalDateTime expireDate;

    /**
     * 订阅阶段
     */
    private SubscriptionPhase phase;

    /**
     * ensure not exist capacity_0.3G data in production db before delete
     */
    @Deprecated
    public String getPlanId() {
        if (planId != null && planId.equals("capacity_0.3G")) {
            return "capacity_300_MB";
        }
        return planId;
    }
}
