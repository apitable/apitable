package com.vikadata.core.support;

/**
 * ResponseData Builder
 */
public interface ResponseDataBuilder {

    /**
     *  build response with response data
     *
     * @param data  the response data field data
     * @param <T>   the response data's type
     * @return the response
     */
    <T> ResponseData<T> data(T data);

    /**
     * build response without response data
     *
     * @param <T> the response data's type
     * @return the response
     */
    <T> ResponseData<T> build();
}
