package com.vikadata.api.modular.social.model;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * 获取内部商品sku页面
 * </p> 
 * @author zoe zheng 
 * @date 2021/10/25 17:55
 */
@ApiModel("钉钉--获取内部商品sku页面")
@Data
public class DingTalkInternalSkuPageRo {
    @ApiModelProperty(value = "空间站ID", required = true, position = 1)
    @NotNull
    private String spaceId;

    @ApiModelProperty(value = "回调页面", position = 2)
    private String callbackPage;

    @ApiModelProperty(value = "如果传入该值，会在订单消息推送时会推送过去。", position = 3)
    private String extendParam;
}
