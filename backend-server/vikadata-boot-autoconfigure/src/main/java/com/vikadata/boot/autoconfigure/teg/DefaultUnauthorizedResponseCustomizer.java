package com.vikadata.boot.autoconfigure.teg;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;


public class DefaultUnauthorizedResponseCustomizer implements UnauthorizedResponseCustomizer {

    @Override
    public void customize(HttpServletResponse response) throws ServletException {
        response.setStatus(401);
    }
}
