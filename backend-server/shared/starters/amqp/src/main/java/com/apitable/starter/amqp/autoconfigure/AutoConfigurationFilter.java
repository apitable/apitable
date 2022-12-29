package com.apitable.starter.amqp.autoconfigure;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import org.springframework.boot.autoconfigure.AutoConfigurationImportFilter;
import org.springframework.boot.autoconfigure.AutoConfigurationMetadata;

public class AutoConfigurationFilter implements AutoConfigurationImportFilter {
    private static final Set<String> SHOULD_SKIP = new HashSet<>(
            Collections.singletonList("com.apitable.starter.autoconfigure.amqp.RabbitAutoConfiguration")
    );

    @Override
    public boolean[] match(String[] classNames, AutoConfigurationMetadata metadata) {
        boolean[] matches = new boolean[classNames.length];

        for (int i = 0; i < classNames.length; i++) {
            matches[i] = !SHOULD_SKIP.contains(classNames[i]);
        }
        return matches;
    }
}
