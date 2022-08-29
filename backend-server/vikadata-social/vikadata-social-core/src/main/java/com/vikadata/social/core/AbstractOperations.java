package com.vikadata.social.core;

import org.springframework.web.client.RestTemplate;

/**
 * 抽象基类
 *
 * @author Shawn Deng
 * @date 2021-01-11 19:19:34
 */
public abstract class AbstractOperations {

    protected RestTemplate restTemplate;

    public AbstractOperations(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
}
