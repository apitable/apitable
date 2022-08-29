package com.vikadata.social.feishu;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.social.feishu.constants.FeishuErrorCode;
import com.vikadata.social.feishu.exception.FeishuApiException;
import com.vikadata.social.feishu.model.FeishuError;

import org.springframework.http.HttpStatus;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.DefaultResponseErrorHandler;


/**
 * 飞书 请求失败拦截处理器
 * 一般代表 http状态响应异常，非200异常
 * 飞书的错误异常都是自定义响应体内容 {@code 内容：{code: 9999, msg: 'need a token'} }, 错误信息需要自己提取其中的msg
 *
 * @author Shawn Deng
 * @date 2020-11-18 17:13:25
 */
public class FeishuResponseErrorHandler extends DefaultResponseErrorHandler {

    private final static Logger LOGGER = LoggerFactory.getLogger(FeishuResponseErrorHandler.class);

    @Override
    protected void handleError(ClientHttpResponse response, HttpStatus statusCode) throws IOException {
        // 状态码存在，额外处理，不抛出RestClientException异常
        try {
            ObjectMapper mapper = new ObjectMapper(new JsonFactory());
            String body = getBodyAsString(response.getBody());
            JsonNode jsonNode = mapper.readValue(body, JsonNode.class);
            Integer code = jsonNode.has("code") ? jsonNode.get("code").intValue() : null;
            String message = jsonNode.has("msg") ? jsonNode.get("msg").asText() : null;
            FeishuError error = new FeishuError(code, message);
            boolean isIgnore = error.getCode().equals(FeishuErrorCode.NO_DEPT_AUTHORITY_ERROR);
            if (!isIgnore) {
                LOGGER.error("调用飞书API异常,是否可以忽略的错误[{}],HTTP状态码:[{}],业务错误码:[{}],业务错误信息:[{}],响应头: \n{}",
                        false, response.getRawStatusCode(),
                        error.getCode(), error.getMsg(), response.getHeaders());
            }

            throw new FeishuApiException(error.getCode(), error.getMsg());
        }
        catch (JsonParseException e) {
            LOGGER.error("解析飞书响应体失败", e);
            throw new RuntimeException("解析飞书响应体失败");
        }
    }

    private String getBodyAsString(InputStream in) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(in));
        StringBuilder sb = new StringBuilder();
        while (reader.ready()) {
            sb.append(reader.readLine());
        }
        return sb.toString();
    }
}
