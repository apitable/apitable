package com.vikadata.api.component.http;

import java.io.UnsupportedEncodingException;
import java.util.Arrays;

import javax.servlet.http.HttpServletResponse;

import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.ContentCachingResponseWrapper;
import org.springframework.web.util.WebUtils;

/**
 * 可视化HTTP响应包装
 * @author Shawn Deng
 * @date 2021-01-25 23:57:13
 */
public class VisibleServletResponse implements VisibleResponse {

    private final HttpServletResponse response;

    public VisibleServletResponse(HttpServletResponse response) {
        this.response = response;
    }

    @Override
    public int getStatus() {
        return this.response.getStatus();
    }

    @Override
    public String getStatusText() {
        return null;
    }

    @Override
    public MultiValueMap<String, String> getHeaders() {
        return this.extractHeaders();
    }

    private MultiValueMap<String, String> extractHeaders() {
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        for (String name : this.response.getHeaderNames()) {
            this.response.getHeaders(name).forEach(hs ->
                    Arrays.stream(hs.split(";")).forEach(h ->
                            headers.add(name, h)));
        }
        return headers;
    }

    @Override
    public String getBody() {
        return getResponseBody(this.response);
    }

    protected String getResponseBody(HttpServletResponse response) {
        String responseBody = "";
        ContentCachingResponseWrapper wrapper = WebUtils.getNativeResponse(response, ContentCachingResponseWrapper.class);
        if (wrapper != null) {
            if (wrapper.getContentSize() <= 0) {
                return responseBody;
            }
            try {
                responseBody = new String(wrapper.getContentAsByteArray(), wrapper.getCharacterEncoding());
            }
            catch (UnsupportedEncodingException e) {
                // Do Nothing
            }
        }
        return responseBody;
    }
}
