package com.vikadata.api.enterprise.gm.model;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class CreateEntitlementWithAddOn {

    @NotBlank(message = "the space id cannot be empty")
    private String spaceId;

    @NotBlank(message = "the additional plan id cannot be empty")
    private String planId;

    private String startDate;

    @Min(1)
    private int months;

    private String remark;
}
