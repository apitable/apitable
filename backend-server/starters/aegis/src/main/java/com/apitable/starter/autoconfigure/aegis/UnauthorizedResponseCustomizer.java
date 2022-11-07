package com.apitable.starter.autoconfigure.aegis;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;

/**
 * Unauthorized customizer
 * @author Shawn Deng
 */
public interface UnauthorizedResponseCustomizer {

    void customize(HttpServletResponse response) throws ServletException;
}
