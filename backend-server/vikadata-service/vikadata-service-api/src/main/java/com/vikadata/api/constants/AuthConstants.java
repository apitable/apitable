package com.vikadata.api.constants;

/**
 * <p>
 * 授权相关接口定义
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/10/26 18:17
 */
public class AuthConstants {

    /**
     * 授权描述
     */
    public static final String AUTH_DESC = "授权登录接口，授权类型说明:\n" +
            "verifyType验证类型为固定值，参考值如下:\n" +
            "password: 密码方式登录\n" +
            "sms_code: 短信验证码登录\n" +
            "email_code: 邮箱验证码登录";
}
