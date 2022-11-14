package com.vikadata.api.enterprise.gm.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("WeCom Isv Permit Ensure All Ro")
public class WeComIsvPermitEnsureAllRo {

    @ApiModelProperty("license order to activate")
    @NotBlank
    private String orderId;

}
