package com.vikadata.api.security.sms;

import cn.hutool.core.util.RandomUtil;
import com.vikadata.api.security.ValidateCode;
import com.vikadata.api.security.ValidateCodeGenerator;
import org.springframework.stereotype.Component;

/**
 * <p>
 * 短信验证码生成器
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/25 15:39
 */
@Component
public class SmsValidateCodeGenerator implements ValidateCodeGenerator {

    @Override
    public ValidateCode generate() {
        String randomCode = RandomUtil.randomNumbers(6);
        return new ValidateCode(randomCode, 900);
    }
}
