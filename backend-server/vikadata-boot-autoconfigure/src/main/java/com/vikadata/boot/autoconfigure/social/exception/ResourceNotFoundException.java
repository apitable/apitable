package com.vikadata.boot.autoconfigure.social.exception;

/**
 * @author Shawn Deng
 * @date 2020-11-19 14:30:34
 */
public class ResourceNotFoundException extends ApiException {

    public ResourceNotFoundException(String providerId) {
        super(providerId, "资源接口不存在");
    }
}
