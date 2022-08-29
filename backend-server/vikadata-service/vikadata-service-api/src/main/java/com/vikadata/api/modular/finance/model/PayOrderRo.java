package com.vikadata.api.modular.finance.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * 支付订单视图
 * </p> 
 * @author Shawn Deng 
 * @date 2022/2/15 20:46
 */
@Data
@ApiModel("支付订单视图")
public class PayOrderRo {

    @ApiModelProperty(value = "订单号", example = "SILVER")
    @Deprecated
    private String orderNo;

    @ApiModelProperty(value = "支付渠道类型(wx_pub_qr: 微信Native支付, alipay_pc_direct: 支付宝电脑网站支付)", example = "wx_pub_qr")
    private String payChannel;
}
