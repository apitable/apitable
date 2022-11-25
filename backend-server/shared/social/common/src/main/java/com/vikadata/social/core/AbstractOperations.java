package com.vikadata.social.core;

import org.springframework.web.client.RestTemplate;

public abstract class AbstractOperations {

    protected RestTemplate restTemplate;

    public AbstractOperations(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
}
