package com.vikadata.api.shared.captcha.email;

import cn.hutool.core.util.RandomUtil;
import com.vikadata.api.shared.captcha.ValidateCode;
import com.vikadata.api.shared.captcha.ValidateCodeGenerator;

import org.springframework.stereotype.Component;

/**
 * <p>
 * email verification code generator
 * </p>
 *
 * @author Shawn Deng
 */
@Component
public class EmailValidateCodeGenerator implements ValidateCodeGenerator {

    @Override
    public ValidateCode generate() {
        String randomCode = RandomUtil.randomString(8);
        return new ValidateCode(randomCode, 900);
    }
}
