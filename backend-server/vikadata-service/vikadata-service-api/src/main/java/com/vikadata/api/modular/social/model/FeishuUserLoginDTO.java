package com.vikadata.api.modular.social.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * 飞书用户登录请求参数
 *
 * @author Shawn Deng
 * @date 2020-12-15 12:15:47
 */
@ApiModel("飞书用户登录请求参数")
@Data
public class FeishuUserLoginDTO {

    @NotBlank
    @ApiModelProperty(value = "飞书用户标识", required = true, position = 1)
    private String openId;

    @NotBlank
    @ApiModelProperty(value = "登录用户所在企业标识", required = true, position = 2)
    private String tenantKey;
}
