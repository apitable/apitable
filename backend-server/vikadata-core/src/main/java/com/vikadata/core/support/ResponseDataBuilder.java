package com.vikadata.core.support;

/**
 * ResponseData Builder
 * @author Shawn Deng
 * @date 2021-03-16 14:13:25
 */
public interface ResponseDataBuilder {

    /**
     * 赋值data字段
     * @param data 自定义返回体的data字段
     * @param <T> data字段类型
     * @return 构建好的响应体
     */
    <T> ResponseData<T> data(T data);

    /**
     * 构建没有data字段的响应体
     * @param <T> data字段类型
     * @return 构建好的响应体
     */
    <T> ResponseData<T> build();
}
