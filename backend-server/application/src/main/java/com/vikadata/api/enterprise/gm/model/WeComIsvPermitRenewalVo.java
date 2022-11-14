package com.vikadata.api.enterprise.gm.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("WeCom Isv Permit Renewal Vo")
public class WeComIsvPermitRenewalVo {

    @ApiModelProperty("id")
    private Long id;

    @ApiModelProperty("order id")
    private String orderId;

}
