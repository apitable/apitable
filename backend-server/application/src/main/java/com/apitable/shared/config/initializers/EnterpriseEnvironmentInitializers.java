package com.apitable.shared.config.initializers;

import java.io.IOException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.env.YamlPropertySourceLoader;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.PropertySource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

/**
 * enterprise environment profile initializers.
 */
@Slf4j
public class EnterpriseEnvironmentInitializers
    implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    private final YamlPropertySourceLoader loader = new YamlPropertySourceLoader();

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        ConfigurableEnvironment environment = applicationContext.getEnvironment();
        Resource path = new ClassPathResource("enterprise/enterprise.yml");
        PropertySource<?> propertySource = loadYaml(path);
        if (propertySource != null) {
            environment.getPropertySources().addLast(propertySource);
        }
    }

    private PropertySource<?> loadYaml(Resource path) {
        if (!path.exists()) {
            return null;
        }
        try {
            return this.loader.load("enterprise", path).get(0);
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to load yaml configuration from " + path, ex);
        }
    }
}
