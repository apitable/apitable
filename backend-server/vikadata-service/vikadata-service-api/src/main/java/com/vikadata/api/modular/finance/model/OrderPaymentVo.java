package com.vikadata.api.modular.finance.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * 支付订单详情视图
 * </p> 
 * @author Shawn Deng 
 * @date 2022/2/15 19:13
 */
@Data
@ApiModel("支付订单详情视图")
public class OrderPaymentVo {

    @ApiModelProperty(value = "订单号", example = "20220215185035483353")
    private String orderNo;

    @ApiModelProperty(value = "支付交易号", example = "20220215185035483353")
    private String payTransactionNo;

    @ApiModelProperty(value = "支付渠道=wx_pub_qr，微信支付的二维码", example = "weixin://wxpay/bizpayurl?pr=qnZDTZm")
    private String wxQrCodeLink;

    @ApiModelProperty(value = "支付渠道=alipay_pc_direct，支付宝电脑网站支付的charge对象", example = "weixin://wxpay/bizpayurl?pr=qnZDTZm")
    private String alipayPcDirectCharge;
}
