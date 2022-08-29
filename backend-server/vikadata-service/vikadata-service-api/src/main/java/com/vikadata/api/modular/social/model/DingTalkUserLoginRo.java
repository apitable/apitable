package com.vikadata.api.modular.social.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 钉钉用户登录请求参数
 *
 * @author Shawn Deng
 * @date 2020-12-15 12:15:47
 */
@ApiModel("钉钉应用用户登录请求参数")
@Data
public class DingTalkUserLoginRo {
    @NotBlank
    @ApiModelProperty(value = "免登授权码", required = true, position = 2)
    private String code;
}
