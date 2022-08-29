package com.vikadata.api.security;

/**
 * <p>
 * 校验码处理器规范，封装不同校验码的处理逻辑
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/25 15:25
 */
public interface ValidateCodeProcessor {

    /**
     * 创建验证码并发送
     *
     * @param target 发送目标，可以是手机或邮箱
     * @param scope  验证码作用域
     */
    String createAndSend(ValidateTarget target, CodeValidateScope scope);

    /**
     * 创建验证码并发送
     *
     * @param target 发送目标，可以是手机或邮箱
     * @param scope  验证码作用域
     * @param actual 真实发送
     */
    String createAndSend(ValidateTarget target, CodeValidateScope scope, boolean actual);

    /**
     * 校验验证码
     *
     * @param target            发送目标，可以是手机或邮箱
     * @param code              验证码
     * @param immediatelyDelete 是否马上删除
     * @param scope             验证码作用域
     */
    void validate(ValidateTarget target, String code, boolean immediatelyDelete, CodeValidateScope scope);

    /**
     * 删除验证码
     *
     * @param target 发送目标，可以是手机或邮箱
     * @param scope  验证码作用域
     */
    void delCode(String target, CodeValidateScope scope);

    /**
     * 保存验证通过记录
     *
     * @param target 发送目标，可以是手机或邮箱
     * @author Chambers
     * @date 2021/6/16
     */
    void savePassRecord(String target);

    /**
     * 验证是否已通过验证码校验
     *
     * @param target 发送目标，可以是手机或邮箱
     */
    void verifyIsPass(String target);
}
