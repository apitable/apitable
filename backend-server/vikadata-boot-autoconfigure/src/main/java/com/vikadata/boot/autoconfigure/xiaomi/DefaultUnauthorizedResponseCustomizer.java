package com.vikadata.boot.autoconfigure.xiaomi;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;

/**
 * 未授权默认返回错误
 * @ageuthor Shawn Deng
 * @date 2021-07-01 10:44:38
 */
public class DefaultUnauthorizedResponseCustomizer implements UnauthorizedResponseCustomizer {

    @Override
    public void customize(HttpServletResponse response) throws ServletException {
        // 默认返回标准Http Unauthorized 401 异常
        response.setStatus(401);
    }
}
