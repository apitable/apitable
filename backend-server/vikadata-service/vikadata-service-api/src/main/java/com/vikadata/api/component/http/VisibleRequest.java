package com.vikadata.api.component.http;

import org.springframework.util.MultiValueMap;

/**
 * 可视化Http请求接口
 * @author Shawn Deng
 * @date 2021-01-25 17:55:06
 */
public interface VisibleRequest {

    /**
     * 获取URL
     * @return URL
     */
    String getURL();

    /**
     * 获取请求方式
     * @return 请求方式
     */
    String getMethod();

    /**
     * 请求头
     * @return 请求头
     */
    MultiValueMap<String, String> getHeaders();

    /**
     * 查询参数
     * @return 查询参数
     */
    String getQueryString();

    /**
     * 请求体
     * @return 请求体
     */
    String getRequestBody();

    /**
     * 请求地址
     * @return 请求地址
     */
    String getRemoteAddress();
}
