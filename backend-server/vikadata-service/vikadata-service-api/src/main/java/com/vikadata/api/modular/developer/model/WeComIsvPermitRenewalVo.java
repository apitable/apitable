package com.vikadata.api.modular.developer.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 企微服务商下单续期接口许可
 * </p>
 * @author 刘斌华
 * @date 2022-07-04 16:07:01
 */
@Data
@ApiModel("企微服务商下单续期接口许可")
public class WeComIsvPermitRenewalVo {

    @ApiModelProperty("主键 ID")
    private Long id;

    @ApiModelProperty("订单号")
    private String orderId;

}
