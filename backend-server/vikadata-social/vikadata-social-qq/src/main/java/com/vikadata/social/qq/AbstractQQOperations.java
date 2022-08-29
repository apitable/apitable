package com.vikadata.social.qq;

import com.vikadata.social.core.AbstractOperations;

import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

/**
 * QQ网页应用操作抽象类
 * @author Shawn Deng
 * @date 2021-04-13 17:52:47
 */
public abstract class AbstractQQOperations extends AbstractOperations {

    public AbstractQQOperations(RestTemplate restTemplate) {
        super(restTemplate);
    }

    protected <T> T doGet(String url, Class<T> responseClass) throws QQException {
        try {
            ResponseEntity<T> response = this.restTemplate.getForEntity(url, responseClass);
            return response.getBody();
        }
        catch (RestClientException ex) {
            throw new QQException(ex.getMessage());
        }
    }
}
