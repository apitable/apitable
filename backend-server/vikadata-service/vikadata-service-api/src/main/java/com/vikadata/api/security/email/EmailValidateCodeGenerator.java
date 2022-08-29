package com.vikadata.api.security.email;

import cn.hutool.core.util.RandomUtil;
import com.vikadata.api.security.ValidateCode;
import com.vikadata.api.security.ValidateCodeGenerator;
import org.springframework.stereotype.Component;

/**
 * <p>
 * 邮箱验证码生成器
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/25 15:39
 */
@Component
public class EmailValidateCodeGenerator implements ValidateCodeGenerator {

    @Override
    public ValidateCode generate() {
        String randomCode = RandomUtil.randomString(8);
        return new ValidateCode(randomCode, 900);
    }
}
