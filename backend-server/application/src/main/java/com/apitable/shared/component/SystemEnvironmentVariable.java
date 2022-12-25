package com.apitable.shared.component;

import cn.hutool.core.util.BooleanUtil;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class SystemEnvironmentVariable {

    @Value("${TEST_ENABLED:false}")
    private String testEnabled;

    public boolean isTestEnabled() {
        return BooleanUtil.toBoolean(testEnabled);
    }
}
