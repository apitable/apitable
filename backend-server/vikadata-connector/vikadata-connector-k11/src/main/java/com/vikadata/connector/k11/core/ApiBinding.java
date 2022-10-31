package com.vikadata.connector.k11.core;

import org.springframework.http.client.OkHttp3ClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

/**
 * <p>
 * ApiBinding
 * </p>
 */
public abstract class ApiBinding {

    private final RestTemplate restTemplate;

    protected ApiBinding() {
        this.restTemplate = createRestTemplate();
    }

    private RestTemplate createRestTemplate() {
        RestTemplate client = new RestTemplate();
        client.setRequestFactory(new OkHttp3ClientHttpRequestFactory());
        return client;
    }

    protected RestTemplate getRestTemplate() {
        return restTemplate;
    }
}
