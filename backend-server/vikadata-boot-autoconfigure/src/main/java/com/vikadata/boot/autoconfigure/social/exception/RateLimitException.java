package com.vikadata.boot.autoconfigure.social.exception;

/**
 * 限流异常
 *
 * @author Shawn Deng
 * @date 2020-11-19 10:29:35
 */
public class RateLimitException extends ApiException {

    public RateLimitException(String providerId) {
        super(providerId, "请求操作过于频繁");
    }
}
