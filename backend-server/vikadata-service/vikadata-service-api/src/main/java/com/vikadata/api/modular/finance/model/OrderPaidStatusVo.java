package com.vikadata.api.modular.finance.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * 订单支付状态视图
 * </p> 
 * @author Shawn Deng 
 * @date 2022/2/15 19:13
 */
@Data
@ApiModel("订单支付状态视图")
public class OrderPaidStatusVo {

    @ApiModelProperty(value = "订单号", example = "20220215185035483353")
    private String orderNo;

    @ApiModelProperty(value = "支付交易号", example = "2022021518503548111")
    private String payTransactionNo;

    @ApiModelProperty(value = "订单状态", example = "Canceled")
    private String status;
}
