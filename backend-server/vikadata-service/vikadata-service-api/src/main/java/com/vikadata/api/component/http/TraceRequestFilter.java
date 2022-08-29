package com.vikadata.api.component.http;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Objects;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.http.HttpTraceLog.Response;

import org.springframework.boot.actuate.web.trace.servlet.HttpTraceFilter;
import org.springframework.core.Ordered;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;
import org.springframework.web.util.WebUtils;

import static com.vikadata.api.constants.FilterConstants.TRACE_REQUEST_FILTER;

/**
 * Http 追踪过滤器
 * 规则参考 {@link HttpTraceFilter}
 * @author Shawn Deng
 * @date 2021-01-26 11:12:47
 */
@Slf4j
public class TraceRequestFilter extends OncePerRequestFilter implements Ordered {

    private final HttpTraceLogRepository repository;

    private final ObjectMapper objectMapper;

    @Override
    public int getOrder() {
        return TRACE_REQUEST_FILTER;
    }

    public TraceRequestFilter(HttpTraceLogRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if (!isRequestValid(request)) {
            filterChain.doFilter(request, response);
            return;
        }
        if (!(request instanceof ContentCachingRequestWrapper)) {
            request = new ContentCachingRequestWrapper(request);
        }
        if (!(response instanceof ContentCachingResponseWrapper)) {
            response = new ContentCachingResponseWrapper(response);
        }
        try {
            filterChain.doFilter(request, response);
        }
        finally {
            if (getEnvironment().containsProperty("local")) {
                HttpTraceLog traceLog = exchangeRequest(request);
                appendResponse(traceLog, response);
                logPrettyIfDebug(traceLog);
                // 可以自定义存储库存起来（Redis/MongoDB/MySQL）
                this.repository.save(traceLog);
            }
            // 响应给客户端
            ContentCachingResponseWrapper responseWrapper = WebUtils.getNativeResponse(response, ContentCachingResponseWrapper.class);
            Objects.requireNonNull(responseWrapper).copyBodyToResponse();
        }
    }

    protected boolean isRequestValid(HttpServletRequest request) {
        try {
            new URI(request.getRequestURL().toString());
            return true;
        }
        catch (URISyntaxException ex) {
            return false;
        }
    }

    private static HttpTraceLog exchangeRequest(HttpServletRequest request) {
        return new HttpTraceLog(new VisibleServletRequest(request));
    }

    private static void appendResponse(HttpTraceLog traceLog, HttpServletResponse response) {
        traceLog.setTimeTaken(System.currentTimeMillis() - traceLog.getTimestamp().toEpochMilli());
        traceLog.setResponse(new Response(new VisibleServletResponse(response)));
    }

    private void logPrettyIfDebug(HttpTraceLog traceLog) {
        if (log.isDebugEnabled()) {
            StringBuilder output = new StringBuilder(256);
            output.append("\n***********************Request Debugger**************************\n");
            String prettyJson = new PrettyHttpTraceLogWrapper(this.objectMapper, traceLog).toJson();
            output.append(prettyJson);
            output.append("\n***************************++++++********************************");
            log.debug(output.toString());
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String servletPath = request.getServletPath();
        // 健康检查请求不记录
        boolean containsActuatorPath = servletPath.contains("actuator");
        // Swagger文档请求不记录
        boolean containSwagger = servletPath.contains("webjars")
            || servletPath.contains("swagger-resources")
            || servletPath.contains("swagger-ui")
            || servletPath.contains("api-docs")
            || servletPath.contains("doc.html")
            || servletPath.contains("api-docs-ext");
        return containsActuatorPath || containSwagger;
    }
}
