package com.vikadata.api.model.ro.user;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 验证码校验请求参数
 * </p>
 * @author Pengap
 * @date 2021/10/20 20:38:34
 */
@Data
@ApiModel("手机验证码校验请求参数")
public class CodeValidateRo {

    @ApiModelProperty(value = "验证码", example = "123456", position = 3, required = true)
    @NotBlank(message = "验证码不能为空")
    private String code;

}
