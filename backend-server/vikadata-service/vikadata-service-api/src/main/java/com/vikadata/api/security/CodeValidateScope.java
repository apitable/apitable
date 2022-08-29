package com.vikadata.api.security;

/**
 * <p>
 * 全局验证码业务类型作用域
 * 其他验证码与这个相对应
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/26 15:30
 */
public enum CodeValidateScope {

    /**
     * 注册
     */
    REGISTER,

    /**
     * 登录
     */
    LOGIN,

    /**
     * 修改登录密码
     */
    UPDATE_PWD,

    /**
     * 绑定手机
     */
    BOUND_MOBILE,

    /**
     * 解除手机绑定
     */
    UN_BOUND_MOBILE,

    /**
     * 修改邮箱绑定
     */
    UPDATE_EMAIL,

    /**
     * 邮箱绑定（邮件验证码类型）
     */
    BOUND_EMAIL,

    /**
     * 邮箱注册（邮件验证码类型）
     */
    REGISTER_EMAIL,

    /**
     * 通用校验（邮件验证码类型）
     */
    COMMON_VERIFICATION,

    /**
     * 删除空间
     */
    DEL_SPACE,

    /**
     * 更换主管理员
     */
    UPDATE_MAIN_ADMIN,

    /**
     * 钉钉绑定
     */
    BOUND_DINGTALK,

    /**
     * 普通验证
     */
    GENERAL_VERIFICATION,

    /**
     * 更换开发者配置
     */
    RESET_API_KEY,

    /**
     * 绑定第三方平台账户
     */
    SOCIAL_USER_BIND;

    /**
     * 根据名称转换
     */
    public static CodeValidateScope fromName(String name) {
        CodeValidateScope scope = null;
        for (CodeValidateScope ele : CodeValidateScope.values()) {
            if (ele.name().equalsIgnoreCase(name)) {
                scope = ele;
                break;
            }
        }

        if (scope == null) {
            throw new IllegalArgumentException("未知的验证码类型");
        }

        return scope;
    }
}
