package com.vikadata.api.model.ro.user;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 注册操作请求参数
 *
 * @author Chambers
 * @since 2019/10/15
 */
@Data
@ApiModel("注册操作请求参数")
public class RegisterOpRo {

    @ApiModelProperty(value = "保存微信unionId、手机号的token", example = "thisistoken", position = 1, required = true)
    @NotBlank(message = "token不能为空")
    private String token;

    @ApiModelProperty(value = "注册邀请码", example = "vikatest", position = 2, required = true)
    private String inviteCode;
}
