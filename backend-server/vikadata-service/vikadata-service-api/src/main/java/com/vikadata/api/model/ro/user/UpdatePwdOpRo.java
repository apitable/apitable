package com.vikadata.api.model.ro.user;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.enums.action.ValidateType;

/**
 * <p>
 * 修改密码请求参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/25 14:08
 */
@Data
@ApiModel("修改密码请求参数")
public class UpdatePwdOpRo {

    @ApiModelProperty(value = "校验类型（sms_code/email_code，两者皆无不传）", example = "sms_code")
    private ValidateType type;

    @ApiModelProperty(value = "手机/邮件 验证码", example = "123456", position = 2)
    private String code;

    @ApiModelProperty(value = "密码", example = "qwer1234", position = 3, required = true)
    private String password;
}
