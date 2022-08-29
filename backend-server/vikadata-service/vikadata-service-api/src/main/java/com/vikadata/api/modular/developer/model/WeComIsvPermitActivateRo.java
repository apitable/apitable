package com.vikadata.api.modular.developer.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 企微服务商激活接口许可
 * </p>
 * @author 刘斌华
 * @date 2022-06-24 09:49:27
 */
@Data
@ApiModel("企微服务商激活接口许可")
public class WeComIsvPermitActivateRo {

    @ApiModelProperty("要激活的接口许可订单号")
    @NotBlank
    private String orderId;

}
