package com.vikadata.api.component.http;

import java.io.UnsupportedEncodingException;
import java.util.Arrays;
import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;

import org.springframework.security.web.util.UrlUtils;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.WebUtils;

/**
 * 简单的可视化请求包装
 * @author Shawn Deng
 * @date 2021-01-25 19:45:23
 */
public class VisibleServletRequest implements VisibleRequest {

    private HttpServletRequest request;

    public VisibleServletRequest(HttpServletRequest request) {
        this.request = request;
    }

    @Override
    public String getURL() {
        return UrlUtils.buildRequestUrl(request);
    }

    @Override
    public String getMethod() {
        return this.request.getMethod();
    }

    @Override
    public MultiValueMap<String, String> getHeaders() {
        return extractHeaders();
    }

    @Override
    public String getQueryString() {
        return extractParameter();
    }

    @Override
    public String getRequestBody() {
        return getRequestBody(this.request);
    }

    private MultiValueMap<String, String> extractHeaders() {
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        Enumeration<String> names = this.request.getHeaderNames();
        while (names.hasMoreElements()) {
            String name = names.nextElement();
            Arrays.stream(this.request.getHeader(name).split(";"))
                    .forEach(h -> headers.add(name, h));
        }
        return headers;
    }

    private String extractParameter() {
        return this.request.getQueryString();
    }

    private String getRequestBody(HttpServletRequest request) {
        String requestBody = "";
        ContentCachingRequestWrapper wrapper = WebUtils.getNativeRequest(request, ContentCachingRequestWrapper.class);
        if (wrapper != null) {
            if (wrapper.getContentLength() <= 0) {
                return requestBody;
            }
            try {
                requestBody = new String(wrapper.getContentAsByteArray(), wrapper.getCharacterEncoding());
            }
            catch (UnsupportedEncodingException e) {
                // Do Nothing
            }
        }
        return requestBody;
    }

    @Override
    public String getRemoteAddress() {
        return this.request.getRemoteAddr();
    }
}
