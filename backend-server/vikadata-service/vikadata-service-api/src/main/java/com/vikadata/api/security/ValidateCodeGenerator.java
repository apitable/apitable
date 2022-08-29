package com.vikadata.api.security;

/**
 * <p>
 * 验证码生成器接口
 * 可能每个安全验证的方式生成验证码都不一样，需要抽取出来
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/25 15:38
 */
public interface ValidateCodeGenerator {

    /**
     * 生成验证码
     *
     * @return ValidateCode
     * @author Shawn Deng
     * @date 2020/1/29 20:54
     */
    ValidateCode generate();
}
