package com.vikadata.api.modular.finance.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * Pay Order Request Object
 * </p>
 */
@Data
@ApiModel("Pay Order Request Object")
public class PayOrderRo {

    @ApiModelProperty(value = "order no", example = "SILVER")
    @Deprecated
    private String orderNo;

    @ApiModelProperty(value = "payment channel type (wx_pub_qr: WeChat Native payment, alipay_pc_direct: Alipay computer website payment)", example = "wx_pub_qr")
    private String payChannel;
}
