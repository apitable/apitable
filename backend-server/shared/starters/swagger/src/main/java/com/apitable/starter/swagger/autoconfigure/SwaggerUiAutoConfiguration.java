package com.apitable.starter.swagger.autoconfigure;

import springfox.documentation.swagger.web.UiConfiguration;
import springfox.documentation.swagger.web.UiConfigurationBuilder;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * autoconfiguration of Swagger UI
 *
 * @author Shawn Deng
 */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(SwaggerUiProperties.class)
public class SwaggerUiAutoConfiguration {

    private final SwaggerUiProperties properties;

    public SwaggerUiAutoConfiguration(SwaggerUiProperties properties) {
        this.properties = properties;
    }

    @Bean
    @ConditionalOnMissingBean
    public UiConfiguration uiConfiguration() {
        return UiConfigurationBuilder.builder()
            .deepLinking(properties.getDeepLinking())
            .displayOperationId(properties.getDisplayOperationId())
            .defaultModelExpandDepth(properties.getDefaultModelExpandDepth())
            .defaultModelsExpandDepth(properties.getDefaultModelsExpandDepth())
            .defaultModelRendering(properties.getDefaultModelRendering())
            .displayRequestDuration(properties.getDisplayRequestDuration())
            .docExpansion(properties.getDocExpansion())
            .filter(properties.getFilter())
            .maxDisplayedTags(properties.getMaxDisplayedTags())
            .operationsSorter(properties.getOperationsSorter())
            .showExtensions(properties.getShowExtensions())
            .showCommonExtensions(properties.getShowCommonExtensions())
            .tagsSorter(properties.getTagsSorter())
            .supportedSubmitMethods(properties.getSubmitMethods())
            .validatorUrl(properties.getValidatorUrl())
            .build();
    }
}
