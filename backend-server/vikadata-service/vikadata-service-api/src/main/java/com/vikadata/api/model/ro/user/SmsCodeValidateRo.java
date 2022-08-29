package com.vikadata.api.model.ro.user;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 手机验证码校验请求参数
 *
 * @author Chambers
 * @since 2019/10/16
 */
@Data
@ApiModel("手机验证码校验请求参数")
public class SmsCodeValidateRo {

    @NotBlank(message = "手机区号不能为空")
    @ApiModelProperty(value = "区号", example = "+86", position = 1, required = true)
    private String areaCode;

    @ApiModelProperty(value = "手机号码", example = "13411112222", position = 2, required = true)
    @NotBlank(message = "手机号码不能为空")
    private String phone;

    @ApiModelProperty(value = "手机验证码", example = "123456", position = 3, required = true)
    @NotBlank(message = "验证码不能为空")
    private String code;
}
