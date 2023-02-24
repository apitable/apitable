package com.apitable.shared.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * SpringDocConfig.
 */
@Configuration
public class SpringDocConfig {
    private String title = "Api Document";
    private String description = "Springdoc-openapi api document";
    private String version = "v1";

    /**
     * OpenAPI config.
     */
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
            .info(new Info().title(title)
            .description(description)
            .version(version));
    }
}
