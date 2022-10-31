package com.vikadata.api.modular.space.model;

import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Attach Subscription Plan Order")
public class SpaceSubscriptionDto {

    private String productCategory;

    private String planId;

    private String metadata;

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
