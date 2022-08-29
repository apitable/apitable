package com.vikadata.api.security;

/**
 * <p>
 * 验证码存取接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/25 14:43
 */
public interface ValidateCodeRepository {

    /**
     * 保存验证码
     *
     * @param type          验证码类型
     * @param code          验证码信息
     * @param target        验证对象，手机或邮箱
     * @param effectiveTime 有效时间，单位：分钟
     */
    void save(String type, ValidateCode code, String target, int effectiveTime);

    /**
     * 获取验证码
     *
     * @param type   验证码类型
     * @param target 验证对象，手机或邮箱
     * @param scope  作用域
     * @return ValidateCode
     */
    ValidateCode get(String target, ValidateCodeType type, String scope);

    /**
     * 移除验证码
     *
     * @param type   验证码类型
     * @param target 验证对象，手机或邮箱
     * @param scope  作用域
     */
    void remove(String target, ValidateCodeType type, String scope);
}
