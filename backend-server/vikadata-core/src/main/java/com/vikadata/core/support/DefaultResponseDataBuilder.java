package com.vikadata.core.support;

/**
 * 默认响应内容构造器
 * @author Shawn Deng
 * @date 2021-03-16 14:15:21
 */
public class DefaultResponseDataBuilder implements ResponseDataBuilder {

    private final Boolean success;

    private final Integer statusCode;

    private final String message;

    public DefaultResponseDataBuilder(Boolean success, Integer statusCode, String message) {
        this.success = success;
        this.statusCode = statusCode;
        this.message = message;
    }

    @Override
    public <T> ResponseData<T> data(T data) {
        return new ResponseData<>(success, this.statusCode, this.message, data);
    }

    @Override
    public <T> ResponseData<T> build() {
        return data(null);
    }
}
