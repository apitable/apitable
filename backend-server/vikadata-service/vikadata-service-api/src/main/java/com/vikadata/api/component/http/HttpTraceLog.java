package com.vikadata.api.component.http;

import java.time.Instant;

import org.springframework.util.MultiValueMap;

/**
 * HTTP 追踪日志
 * @author Shawn Deng
 * @date 2021-01-26 13:01:12
 */
public class HttpTraceLog {

    private final Instant timestamp;

    private volatile Long timeTaken;

    private final Request request;

    private volatile Response response;

    HttpTraceLog(VisibleRequest request) {
        this.request = new Request(request);
        this.timestamp = Instant.now();
    }

    public Instant getTimestamp() {
        return this.timestamp;
    }

    public Long getTimeTaken() {
        return this.timeTaken;
    }

    void setTimeTaken(long timeTaken) {
        this.timeTaken = timeTaken;
    }

    public Request getRequest() {
        return request;
    }

    public Response getResponse() {
        return response;
    }

    public void setResponse(Response response) {
        this.response = response;
    }

    public static final class Request {

        private final String method;

        private final String uri;

        private final MultiValueMap<String, String> headers;

        private final String args;

        private final String requestBody;

        private final String remoteAddress;

        private Request(VisibleRequest request) {
            this(request.getMethod(), request.getURL(), request.getHeaders(), request.getQueryString(), request.getRequestBody(), request.getRemoteAddress());
        }

        public Request(String method, String uri, MultiValueMap<String, String> headers, String args, String requestBody, String remoteAddress) {
            this.method = method;
            this.uri = uri;
            this.headers = headers;
            this.args = args;
            this.requestBody = requestBody;
            this.remoteAddress = remoteAddress;
        }

        public String getMethod() {
            return this.method;
        }

        public String getUri() {
            return this.uri;
        }

        public MultiValueMap<String, String> getHeaders() {
            return headers;
        }

        public String getRemoteAddress() {
            return this.remoteAddress;
        }

        public String getArgs() {
            return this.args;
        }

        public String getRequestBody() {
            return this.requestBody;
        }
    }

    public static final class Response {

        private final int status;

        private final MultiValueMap<String, String> headers;

        private final String responseBody;

        Response(VisibleResponse response) {
            this(response.getStatus(), response.getHeaders(), response.getBody());
        }

        public Response(int status, MultiValueMap<String, String> headers, String responseBody) {
            this.status = status;
            this.headers = headers;
            this.responseBody = responseBody;
        }

        public int getStatus() {
            return this.status;
        }

        public MultiValueMap<String, String> getHeaders() {
            return headers;
        }

        public String getResponseBody() {
            return this.responseBody;
        }

    }
}
