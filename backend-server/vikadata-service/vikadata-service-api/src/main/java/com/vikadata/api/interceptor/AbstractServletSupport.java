package com.vikadata.api.interceptor;

import javax.servlet.http.HttpServletRequest;

/**
 * <p>
 * 拦截器基类
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/9 23:18
 */
public abstract class AbstractServletSupport {

    /**
     * 解析servlet path
     *
     * @param httpServletRequest servlet对象
     * @return servlet path
     */
    protected String resolveServletPath(HttpServletRequest httpServletRequest) {
        String requestPath = httpServletRequest.getServletPath();
        String suffix = "/";
        if (requestPath.length() > 1 && requestPath.endsWith(suffix)) {
            // /foo/ -> /foo
            requestPath = requestPath.substring(0, requestPath.length() - 1);
        }
        return requestPath;
    }

}
