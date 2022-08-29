package com.vikadata.api.component.audit;

/**
 * <p>
 * 空间行为审计的租户存储位置
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/4/22 19:29
 */
public enum ParamLocation {

    /**
     * 默认无
     */
    NONE,

    /**
     * 头部
     */
    HEADER,

    /**
     * query参数
     */
    QUERY,

    /**
     * 请求路径
     */
    PATH,

    /**
     * 请求体
     */
    BODY,

    /**
     * 响应体
     */
    RESPONSE
}
