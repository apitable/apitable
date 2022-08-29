package com.vikadata.boot.autoconfigure.xiaomi;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;

/**
 * 米盾过滤异常定义
 * @author Shawn Deng
 * @date 2021-06-30 20:35:33
 */
public interface UnauthorizedResponseCustomizer {

    void customize(HttpServletResponse response) throws ServletException;
}
