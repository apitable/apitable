package com.vikadata.api.space.model;

import java.time.LocalDateTime;

import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
}
