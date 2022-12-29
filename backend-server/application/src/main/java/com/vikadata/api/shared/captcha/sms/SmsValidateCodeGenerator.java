package com.vikadata.api.shared.captcha.sms;

import cn.hutool.core.util.RandomUtil;
import com.vikadata.api.shared.captcha.ValidateCode;
import com.vikadata.api.shared.captcha.ValidateCodeGenerator;
import org.springframework.stereotype.Component;

/**
 * <p>
 * SMS verification code generator
 * </p>
 *
 * @author Shawn Deng
 */
@Component
public class SmsValidateCodeGenerator implements ValidateCodeGenerator {

    @Override
    public ValidateCode generate() {
        String randomCode = RandomUtil.randomNumbers(6);
        return new ValidateCode(randomCode, 900);
    }
}
