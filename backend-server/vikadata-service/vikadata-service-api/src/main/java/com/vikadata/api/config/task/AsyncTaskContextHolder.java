package com.vikadata.api.config.task;

import java.util.Objects;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * 异步任务线程变量
 * @author Shawn Deng
 * @date 2021-01-27 12:51:35
 */
public class AsyncTaskContextHolder {

    public static HttpServletRequest getServletRequest() {
        return ((ServletRequestAttributes) Objects.requireNonNull(RequestContextHolder.getRequestAttributes())).getRequest();
    }
}
