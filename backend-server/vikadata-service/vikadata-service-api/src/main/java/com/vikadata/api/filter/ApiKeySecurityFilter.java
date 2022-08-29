package com.vikadata.api.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.extern.slf4j.Slf4j;

import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import static com.vikadata.api.constants.FilterConstants.API_KEY_SECURITY_FILTER;

/**
 * Api key 验证
 * @author Shawn Deng
 * @date 2021-07-06 11:54:51
 */
@Component
@Slf4j
public class ApiKeySecurityFilter extends OncePerRequestFilter implements Ordered {

    @Override
    public int getOrder() {
        return API_KEY_SECURITY_FILTER;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        filterChain.doFilter(request, response);
    }
}
