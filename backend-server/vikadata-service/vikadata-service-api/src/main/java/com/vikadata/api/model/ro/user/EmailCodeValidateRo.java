package com.vikadata.api.model.ro.user;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Pattern.Flag;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.constants.PatternConstants;

/**
 * <p>
 * 邮箱验证码校验请求参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/26 15:14
 */
@Data
@ApiModel("邮箱验证码校验请求参数")
public class EmailCodeValidateRo {

    @ApiModelProperty(value = "邮箱地址", example = "xxxx@vikadata.com", position = 1, required = true)
    @NotBlank(message = "邮箱地址不能为空")
    @Pattern(regexp = PatternConstants.EMAIL, message = "邮箱格式不正确", flags = Flag.CASE_INSENSITIVE)
    private String email;

    @ApiModelProperty(value = "邮箱验证码", example = "123456", position = 2, required = true)
    @NotBlank(message = "验证码不能为空")
    private String code;
}
