package com.apitable.shared.config;

import org.springframework.boot.web.client.RestClientCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

/**
 * Rest client config.
 */
@Configuration(proxyBeanMethods = false)
public class RestClientConfig {

    /**
     * rest client customizer.
     *
     * @return RestClientCustomizer
     */
    @Bean
    RestClientCustomizer restClientCustomizer() {
        return builder -> builder.requestFactory(new HttpComponentsClientHttpRequestFactory());
    }

    /**
     * rest client.
     *
     * @param builder builder
     * @return RestClient
     */
    @Bean
    RestClient restClient(RestClient.Builder builder) {
        return builder.build();
    }
}
