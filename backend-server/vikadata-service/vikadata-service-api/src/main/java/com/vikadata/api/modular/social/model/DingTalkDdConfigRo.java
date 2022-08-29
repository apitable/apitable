package com.vikadata.api.modular.social.model;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * 钉钉dd.config参数获取
 * </p> 
 * @author zoe zheng 
 * @date 2021/10/25 17:55
 */
@ApiModel("钉钉--dd.config参数获取")
@Data
public class DingTalkDdConfigRo {
    @ApiModelProperty(value = "空间站ID", required = true, position = 1)
    @NotNull
    private String spaceId;

    @ApiModelProperty(value = "当前页面地址", position = 2)
    @NotNull
    private String url;
}
