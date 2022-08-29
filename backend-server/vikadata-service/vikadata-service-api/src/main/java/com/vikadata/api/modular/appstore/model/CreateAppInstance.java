package com.vikadata.api.modular.appstore.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 创建应用实例请求参数
 * @author Shawn Deng
 * @date 2022-01-18 01:40:23
 */
@Data
@ApiModel("创建应用实例请求参数")
public class CreateAppInstance {

    @NotBlank
    @ApiModelProperty(value = "空间Id", example = "spc21u12h3")
    private String spaceId;

    @NotBlank
    @ApiModelProperty(value = "应用商城应用标识", example = "app-jh1237123")
    private String appId;
}
