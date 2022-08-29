package com.vikadata.api.component.http;

import java.util.function.Supplier;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.StrUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import com.vikadata.api.component.http.HttpTraceLog.Response;

import org.springframework.util.MultiValueMap;

/**
 *
 * @author Shawn Deng
 * @date 2021-01-26 17:08:16
 */
public class PrettyHttpTraceLogWrapper {

    private ObjectMapper objectMapper;

    private HttpTraceLog httpTraceLog;

    public PrettyHttpTraceLogWrapper(ObjectMapper objectMapper, HttpTraceLog httpTraceLog) {
        this.objectMapper = objectMapper;
        this.httpTraceLog = httpTraceLog;
    }

    public String toPrettyJson() {
        try {
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(buildJson());
        }
        catch (JsonProcessingException e) {
            return null;
        }
    }

    public String toJson() {
        try {
            return objectMapper.writeValueAsString(buildJson());
        }
        catch (JsonProcessingException e) {
            return null;
        }
    }

    private ObjectNode buildJson() {
        ObjectNode jsonNode = this.objectMapper.createObjectNode();
        jsonNode.put("timestamp", DateUtil.formatLocalDateTime(DateUtil.toLocalDateTime(this.httpTraceLog.getTimestamp())));
        jsonNode.put("timeTaken", DateUtil.formatBetween(this.httpTraceLog.getTimeTaken()));

        ObjectNode request = this.objectMapper.createObjectNode();
        request.put("url", this.httpTraceLog.getRequest().getUri());
        request.put("query", this.httpTraceLog.getRequest().getArgs());
        request.put("method", this.httpTraceLog.getRequest().getMethod());
        request.put("remote_address:", this.httpTraceLog.getRequest().getRemoteAddress());
        request.set("headers", prettyHeaders(this.httpTraceLog.getRequest().getHeaders()));
        request.put("playload", getIfOverLimitNot(this.httpTraceLog.getRequest()::getRequestBody));
        jsonNode.set("request", request);

        ObjectNode responseNode = this.objectMapper.createObjectNode();
        Response response = this.httpTraceLog.getResponse();
        responseNode.put("status", response.getStatus());
        responseNode.set("headers", prettyHeaders(this.httpTraceLog.getResponse().getHeaders()));
        responseNode.put("body", getIfOverLimitNot(this.httpTraceLog.getResponse()::getResponseBody));
        jsonNode.set("response", responseNode);
        return jsonNode;
    }

    private ObjectNode prettyHeaders(MultiValueMap<String, String> headers) {
        ObjectNode headerNode = this.objectMapper.createObjectNode();
        headers.forEach((k, v) -> headerNode.put(k, CollUtil.join(v, ",")));
        return headerNode;
    }

    private String getIfOverLimitNot(Supplier<String> valueSupplier) {
        return StrUtil.length(valueSupplier.get()) <= 1000 ? valueSupplier.get() : "内容太大不需要打印";
    }
}
