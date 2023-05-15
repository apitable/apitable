package com.apitable;

import org.jetbrains.annotations.NotNull;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.test.context.support.TestPropertySourceUtils;

public class TestContextInitializer implements
    ApplicationContextInitializer<ConfigurableApplicationContext> {

    static final String PROPERTY_TEST_VALUE = "true";

    @Override
    public void initialize(@NotNull ConfigurableApplicationContext applicationContext) {
        TestPropertySourceUtils.addInlinedPropertiesToEnvironment(
            applicationContext, "system.test-enabled=" + PROPERTY_TEST_VALUE);
    }
}
