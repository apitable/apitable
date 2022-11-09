package com.apitable.starter.teg.autoconfigure;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;

public interface UnauthorizedResponseCustomizer {

    void customize(HttpServletResponse response) throws ServletException;
}
