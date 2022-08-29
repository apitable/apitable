package com.vikadata.api.model.ro.user;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.enums.action.LoginType;

/**
 * <p>
 * 登录请求参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/10/26 14:47
 */
@Data
@ApiModel("授权请求参数")
public class LoginRo {

    @ApiModelProperty(value = "登录名", example = "13829291111 ｜ xxxx@vikadata.com", position = 1, required = true)
    private String username;

    @ApiModelProperty(value = "登陆凭证,根据verifyType类型识别", example = "qwer1234 || 261527", position = 2, required = true)
    private String credential;

    @ApiModelProperty(value = "登录类型，固定值，只能输入password（密码）、sms_code（短信验证吗）、email_code（邮箱验证码）、wechat_sms_code（微信小程序短信验证码）、sso_auth", example = "password", position = 3, required = true)
    private LoginType type;

    @ApiModelProperty(value = "区号（手机号 + 密码/短信验证码 登录时需要）", example = "+86", position = 4)
    private String areaCode;

    @ApiModelProperty(value = "密码登录人机验证，前端获取getNVCVal函数的值", example = "FutureIsComing", position = 4, required = true)
    private String data;

    @ApiModelProperty(value = "第三方账户信息临时保存的token，无绑定维格帐号时返回", example = "this_is_token", position = 5)
    private String token;

    @ApiModelProperty(value = "邀请空间ID，邀请新用户加入空间站获赠附件容量时需要", example = "spcaq8UwsxjAc", position = 6)
    private String spaceId;
}
