package com.vikadata.api.modular.space.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * <p>
 * 附加订阅计划订单信息
 * </p>
 *
 * @author liuzijing
 * @date 2022/8/12
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class SpaceSubscriptionDto {

    /**
     * 产品类型
     */
    private String productCategory;

    /**
     * 产品方案ID
     */
    private String planId;

    /**
     * 元数据
     */
    private String metadata;

    /**
     * 过期时间
     */
    private LocalDateTime expireTime;

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
