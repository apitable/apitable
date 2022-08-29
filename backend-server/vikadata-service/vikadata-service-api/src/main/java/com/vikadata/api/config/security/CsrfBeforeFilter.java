package com.vikadata.api.config.security;

import java.io.IOException;
import java.util.List;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpHeaders;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * <p>
 * 在CsrfFilter前面执行
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/6/23 15:48
 */
@Slf4j
public class CsrfBeforeFilter extends OncePerRequestFilter {
    /**
     * 需要跳过的path,nestjs 调用
     */
    public List<String> ignorePath = CollUtil.newArrayList( "/base/attach/cite");

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String bearerToken = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (log.isDebugEnabled()) {
            log.info("csrf before filter path: {}", request.getServletPath());
        }
        if (StrUtil.isNotBlank(bearerToken) || this.ignorePath.contains(request.getServletPath())) {
            // API_KEY请求不需要CSRF验证
            CsrfFilter.skipRequest(request);
        }
        filterChain.doFilter(request, response);
    }
}
