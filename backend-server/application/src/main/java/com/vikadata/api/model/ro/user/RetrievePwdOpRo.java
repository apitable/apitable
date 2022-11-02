package com.vikadata.api.model.ro.user;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.enums.action.ValidateType;

/**
 * 找回密码请求参数
 *
 * @author Chambers
 * @since 2019/10/16
 */
@Data
@ApiModel("找回密码请求参数")
public class RetrievePwdOpRo {

    @ApiModelProperty(value = "校验类型（sms_code/email_code）", example = "sms_code")
    private ValidateType type;

    @ApiModelProperty(value = "区号（短信验证码时需要）", example = "+86", position = 1)
    private String areaCode;

    @ApiModelProperty(value = "登录名（手机号码/邮箱）", example = "13829291111 ｜ xxx@xx.com", position = 1, required = true)
    private String username;

    @Deprecated
    @ApiModelProperty(value = "手机号码", example = "135...", position = 1)
    private String phone;

    @ApiModelProperty(value = "手机/邮件 验证码", example = "123456", position = 2, required = true)
    private String code;

    @ApiModelProperty(value = "密码", example = "qwer1234", position = 2, required = true)
    private String password;

    @Deprecated
    public String getUsername() {
        // 兼容处理
        if (username == null) {
            return phone;
        }
        return username;
    }
}
