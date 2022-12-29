package com.apitable.starter.aegis.autoconfigure;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;

/**
 * Unauthorized error customizer
 * @author  Shawn Deng
 */
public class DefaultUnauthorizedResponseCustomizer implements UnauthorizedResponseCustomizer {

    @Override
    public void customize(HttpServletResponse response) throws ServletException {
        // return Http Unauthorized 401 exception
        response.setStatus(401);
    }
}
