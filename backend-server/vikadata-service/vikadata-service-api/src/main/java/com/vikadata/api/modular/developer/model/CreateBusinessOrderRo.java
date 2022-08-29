package com.vikadata.api.modular.developer.model;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("商务订单下单请求参数")
public class CreateBusinessOrderRo {

    @NotBlank(message = "空间ID不能为空")
    @ApiModelProperty(value = "空间ID", required = true, example = "spcNrqN2iH0qK")
    private String spaceId;

    @NotBlank(message = "订单类型不能为空")
    @ApiModelProperty(value = "订单类型", required = true, example = "BUY")
    private String type;

    @ApiModelProperty(value = "产品", example = "Enterprise")
    private String product;

    @ApiModelProperty(value = "席位", example = "price_s2sf3f232skad")
    private Integer seat;

    @ApiModelProperty(value = "权益开始日期，不填写代表当天提交时间,续费订阅不需要填写", example = "2021-10-20")
    private String startDate;

    @Min(1)
    @ApiModelProperty(value = "订阅时长(单位:月)", example = "1")
    private int months = 1;

    @ApiModelProperty(value = "备注", example = "可以描述这个订单的特殊性，可选")
    private String remark;
}
