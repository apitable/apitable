package com.vikadata.api.shared.security.sms;

import cn.hutool.core.util.RandomUtil;
import com.vikadata.api.shared.security.ValidateCode;
import com.vikadata.api.shared.security.ValidateCodeGenerator;
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
