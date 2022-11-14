package com.vikadata.api.enterprise.billing.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * Payment Order Status View
 * </p>
 */
@Data
@ApiModel("Payment Order Status View")
public class PaymentOrderStatusVo {

    @ApiModelProperty(value = "pay transaction no", example = "2022021518503548111")
    @Deprecated
    private String payTransactionNo;

    @ApiModelProperty(value = "order status", example = "Canceled")
    private String status;
}
