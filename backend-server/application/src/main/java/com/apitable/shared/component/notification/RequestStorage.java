package com.apitable.shared.component.notification;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import org.springframework.web.util.ContentCachingRequestWrapper;

/**
 * request storage.
 *
 * @author Shawn Deng
 */
public class RequestStorage {

    private final String servletPath;

    private final Map<String, String> headerMap;

    private final Map<String, String> paramMap;

    private final byte[] requestContentAsByteArray;

    /**
     * construct.
     *
     * @param servletPath               servlet path
     * @param headerMap                 header map
     * @param paramMap                  parameter map
     * @param requestContentAsByteArray request body
     */
    public RequestStorage(String servletPath, Map<String, String> headerMap,
                          Map<String, String> paramMap, byte[] requestContentAsByteArray) {
        this.servletPath = servletPath;
        this.headerMap = headerMap;
        this.paramMap = paramMap;
        this.requestContentAsByteArray = requestContentAsByteArray;
    }

    public String getServletPath() {
        return servletPath;
    }

    public Map<String, String> getHeaderMap() {
        return headerMap;
    }

    public Map<String, String> getParamMap() {
        return paramMap;
    }

    public byte[] getRequestContentAsByteArray() {
        return requestContentAsByteArray;
    }

    /**
     * create request parameter storage.
     *
     * @param requestWrapper servlet request
     * @return RequestStorage
     */
    public static RequestStorage create(ContentCachingRequestWrapper requestWrapper) {
        Enumeration<String> requestHeaderNames = requestWrapper.getHeaderNames();
        Map<String, String> headerMap = new HashMap<>();
        while (requestHeaderNames.hasMoreElements()) {
            String name = requestHeaderNames.nextElement();
            headerMap.put(name, requestWrapper.getHeader(name));
        }

        Enumeration<String> requestParameterNames = requestWrapper.getParameterNames();
        Map<String, String> paramMap = new HashMap<>();
        while (requestParameterNames.hasMoreElements()) {
            String name = requestParameterNames.nextElement();
            paramMap.put(name, requestWrapper.getParameter(name));
        }

        return new RequestStorage(requestWrapper.getServletPath(), headerMap, paramMap,
            requestWrapper.getContentAsByteArray());
    }
}
