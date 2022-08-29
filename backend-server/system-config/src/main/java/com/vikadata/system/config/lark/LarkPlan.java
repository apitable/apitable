package com.vikadata.system.config.lark;

import lombok.Data;

/**
 * <p>
 * 飞书-付费方案
 * </p>
 * @author zoe zheng
 * @date 2022/2/25 14:10
 */
@Data
public class LarkPlan {
    private String id;

    private String larkPricePlanId;

    private String billingPriceId;
}
