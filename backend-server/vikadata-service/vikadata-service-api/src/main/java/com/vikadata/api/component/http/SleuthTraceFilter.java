package com.vikadata.api.component.http;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import brave.Span;
import brave.Tracer;

import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import static com.vikadata.api.constants.FilterConstants.SLEUTH_TRACE_FILTER;

/**
 *
 * @author Shawn Deng
 * @date 2021-01-28 18:13:56
 */
@Component
public class SleuthTraceFilter extends OncePerRequestFilter implements Ordered {

    private static final String TRACE_ID = "X-Trace-Id";

    private static final String SPAN_ID = "X-Span-Id";

    private final Tracer tracer;

    public SleuthTraceFilter(Tracer tracer) {
        this.tracer = tracer;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Span currentSpan = tracer.currentSpan();
        if (currentSpan == null) {
            filterChain.doFilter(request, response);
            return;
        }
        response.addHeader(TRACE_ID, currentSpan.context().traceIdString());
        response.addHeader(SPAN_ID, currentSpan.context().spanIdString());
        filterChain.doFilter(request, response);
    }

    @Override
    public int getOrder() {
        return SLEUTH_TRACE_FILTER;
    }
}
