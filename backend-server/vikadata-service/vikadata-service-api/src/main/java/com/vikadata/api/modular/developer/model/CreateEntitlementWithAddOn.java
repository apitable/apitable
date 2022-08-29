package com.vikadata.api.modular.developer.model;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class CreateEntitlementWithAddOn {

    @NotBlank(message = "空间ID不能为空")
    private String spaceId;

    @NotBlank(message = "附加计划ID不能为空")
    private String planId;

    private String startDate;

    @Min(1)
    private int months;

    private String remark;
}
