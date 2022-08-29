package com.vikadata.api.support;

import com.vikadata.api.component.ApiResourceFactory;

/**
 * <p>
 * 资源处理接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2018/11/10 17:03
 */
public interface ResourceHandlerSupport {

    /**
     * 处理资源
     *
     * @param apiResourceFactory 资源工厂
     * @author Shawn Deng
     * @date 2019-04-08 16:56
     */
    void doHandle(ApiResourceFactory apiResourceFactory);
}
