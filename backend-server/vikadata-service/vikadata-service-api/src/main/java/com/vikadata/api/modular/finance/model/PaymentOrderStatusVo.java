package com.vikadata.api.modular.finance.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * 支付订单状态视图
 * </p> 
 * @author Shawn Deng 
 * @date 2022/2/15 19:13
 */
@Data
@ApiModel("支付订单状态视图")
public class PaymentOrderStatusVo {

    @ApiModelProperty(value = "支付交易号", example = "2022021518503548111")
    @Deprecated
    private String payTransactionNo;

    @ApiModelProperty(value = "订单状态", example = "Canceled")
    private String status;
}
