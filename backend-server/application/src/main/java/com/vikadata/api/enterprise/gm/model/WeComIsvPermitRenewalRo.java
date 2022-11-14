package com.vikadata.api.enterprise.gm.model;

import java.util.List;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("WeCom Isv Permit Renewal Ro")
public class WeComIsvPermitRenewalRo {

    @ApiModelProperty("the renewal space")
    @NotBlank
    private String spaceId;

    @ApiModelProperty("wecom users who want to renew")
    @NotEmpty
    private List<String> cpUserIds;

    @ApiModelProperty("the number of months to purchase the account. take 31 days as a month, max 36 months")
    @NotNull
    @Min(1)
    @Max(36)
    private Integer durationMonths;

}
