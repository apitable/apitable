package com.vikadata.boot.autoconfigure.teg;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;


public interface UnauthorizedResponseCustomizer {

    void customize(HttpServletResponse response) throws ServletException;
}
