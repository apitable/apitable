package com.vikadata.api.modular.developer.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 企微服务商下单购买接口许可
 * </p>
 * @author 刘斌华
 * @date 2022-06-24 11:42:50
 */
@Data
@ApiModel("企微服务商下单购买接口许可")
public class WeComIsvPermitNewOrderVo {

    @ApiModelProperty("主键 ID")
    private Long id;

    @ApiModelProperty("订单号")
    private String orderId;

}
