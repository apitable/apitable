package com.vikadata.api.security;

/**
 * <p>
 * captcha generator interface
 * Maybe each security verification method generates different verification codes and needs to be extracted.
 * </p>
 *
 * @author Shawn Deng
 */
public interface ValidateCodeGenerator {

    /**
     * generate verification code
     *
     * @return ValidateCode
     */
    ValidateCode generate();
}
