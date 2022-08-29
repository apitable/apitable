package com.vikadata.api.modular.developer.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 锁定解锁相关参数
 * </p>
 *
 * @author Chambers
 * @date 2020/7/27
 */
@Data
@ApiModel("验证锁定解锁相关参数")
public class UnlockRo {

    @NotBlank(message = "目标值不能为空")
    @ApiModelProperty(value = "目标：手机号/邮箱", required = true, example = "13800138000", position = 1)
    private String target;

    @ApiModelProperty(value = "类型：0、登录频繁（只支持帐号手机号）；1、一分钟内重复获取验证码；2、二十分钟内频繁获取验证码（默认）", example = "0", position = 3)
    private Integer type = 2;
}
