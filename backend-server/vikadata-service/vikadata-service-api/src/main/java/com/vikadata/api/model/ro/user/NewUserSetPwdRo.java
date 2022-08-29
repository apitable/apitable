package com.vikadata.api.model.ro.user;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 新用户设置密码请求参数
 *
 * @author Chambers
 * @since 2019/10/16
 */
@Data
@ApiModel("新用户设置密码请求参数")
public class NewUserSetPwdRo {

    @ApiModelProperty(value = "手机号码", example = "135...", position = 1, required = true)
    private String phone;

    @ApiModelProperty(value = "新密码,展示注意掩码", example = "qwer1234", position = 2, required = true)
    private String newPassword;

    @ApiModelProperty(value = "重复密码,展示注意掩码", example = "qwer1234", position = 3, required = true)
    private String confirmPassword;
}
