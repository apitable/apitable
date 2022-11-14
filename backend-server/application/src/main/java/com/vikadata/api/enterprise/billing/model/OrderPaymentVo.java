package com.vikadata.api.enterprise.billing.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * Order Payment View
 * </p>
 */
@Data
@ApiModel("Order Payment View")
public class OrderPaymentVo {

    @ApiModelProperty(value = "order no", example = "20220215185035483353")
    private String orderNo;

    @ApiModelProperty(value = "pay transaction no", example = "20220215185035483353")
    private String payTransactionNo;

    @ApiModelProperty(value = "payment channel=wx_pub_qr, QR code of WeChat payment", example = "weixin://wxpay/bizpayurl?pr=qnZDTZm")
    private String wxQrCodeLink;

    @ApiModelProperty(value = "payment channel=alipay_pc_direct, the charge object paid by Alipay computer website", example = "weixin://wxpay/bizpayurl?pr=qnZDTZm")
    private String alipayPcDirectCharge;
}
