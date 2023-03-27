package com.apitable.shared.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * SpringDoc Config.
 */
@Configuration
public class SpringDocConfig {

    private static final String DEFAULT_GROUP_NAME = " ";

    /**
     * OpenAPI config.
     */
    @Bean
    public OpenAPI openAPI() {
        Contact contact = new Contact()
            .name("Cloud Backend");
        return new OpenAPI().info(new Info()
            .title("Api Document")
            .description("Backend_Server Api Document")
            .version("v1")
            .termsOfService("/api/v1/doc.htm")
            .contact(contact));
    }

    /**
     * Group config.
     */
    @Bean
    public GroupedOpenApi groupedOpenApi() {
        return GroupedOpenApi.builder()
            .group(DEFAULT_GROUP_NAME)
            .pathsToMatch("/**")
            .build();
    }
}
