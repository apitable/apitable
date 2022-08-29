package com.vikadata.api.security;

import java.util.Map;

import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * <p>
 * 验证码处理管理器
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/26 14:37
 */
@Component
public class ValidateCodeProcessorManage {

    private final Map<String, ValidateCodeProcessor> validateCodeProcessors;

    @Autowired
    public ValidateCodeProcessorManage(Map<String, ValidateCodeProcessor> validateCodeProcessors) {
        this.validateCodeProcessors = validateCodeProcessors;
    }

    public static ValidateCodeProcessorManage me() {
        return SpringContextHolder.getBean(ValidateCodeProcessorManage.class);
    }

    public ValidateCodeProcessor findValidateCodeProcessor(ValidateCodeType type) {
        return findValidateCodeProcessor(type.toString().toLowerCase());
    }

    public ValidateCodeProcessor findValidateCodeProcessor(String type) {
        String name = type.toLowerCase() + ValidateCodeProcessor.class.getSimpleName();
        ValidateCodeProcessor processor = validateCodeProcessors.get(name);
        if (processor == null) {
            throw new RuntimeException("验证码处理器" + name + "不存在");
        }
        return processor;
    }
}
