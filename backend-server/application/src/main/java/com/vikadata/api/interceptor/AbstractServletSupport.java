package com.vikadata.api.interceptor;

import javax.servlet.http.HttpServletRequest;

/**
 * <p>
 * base servlet interceptor
 * </p>
 *
 * @author Shawn Deng
 */
public abstract class AbstractServletSupport {

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
