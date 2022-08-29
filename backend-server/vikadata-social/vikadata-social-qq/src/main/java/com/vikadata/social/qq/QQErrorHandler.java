package com.vikadata.social.qq;

import java.io.IOException;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.springframework.http.HttpStatus;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.DefaultResponseErrorHandler;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.UnknownHttpStatusCodeException;

/**
 * QQ 开放平台调用异常处理
 *
 * @author Shawn Deng
 * @date 2021-01-11 19:27:53
 */
public class QQErrorHandler extends DefaultResponseErrorHandler {

    private static final Log logger = LogFactory.getLog(QQErrorHandler.class);

    private final ObjectMapper objectMapper = new ObjectMapper();

    public QQErrorHandler() {
        objectMapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @Override
    public boolean hasError(ClientHttpResponse response) throws IOException {
        int rawStatusCode = response.getRawStatusCode();
        HttpStatus statusCode = HttpStatus.resolve(rawStatusCode);
        if (statusCode != null) {
            if (statusCode.is2xxSuccessful()) {
                // 解析响应体是否返回成功
                byte[] body = getResponseBody(response);
                JsonNode jsonNode = objectMapper.readTree(body);
                // QQ的oauth2和getUserInfo的结果不是同样的，必须区别开来解析判断
                if (jsonNode.has("error")) {
                    // oauth2接口调用失败
                    logger.error("QQ授权失败，error:" + jsonNode.get("error") + ", description: " + jsonNode.get("error_description"));
                    return true;
                }
                else if (jsonNode.has("ret")) {
                    // getUserInfo接口
                    int ret = jsonNode.get("ret").asInt();
                    if (ret != 0) {
                        logger.error("QQ获取用户信息失败，返回码:" + jsonNode.get("ret") + ", 错误信息: " + jsonNode.get("msg"));
                        return true;
                    }
                }
                return false;
            }
            return super.hasError(statusCode);
        }
        return super.hasError(rawStatusCode);
    }

    @Override
    public void handleError(ClientHttpResponse response) throws IOException {
        if (logger.isDebugEnabled()) {
            logger.debug("Http Response Status: " + response.getRawStatusCode());
        }
        HttpStatus statusCode = HttpStatus.resolve(response.getRawStatusCode());
        if (statusCode != null) {
            if (statusCode.is2xxSuccessful()) {
                // 从上面hasError()方法自定义解析继承下来的错误，HTTP状态码依然是200成功
                byte[] body = getResponseBody(response);
                JsonNode jsonNode = objectMapper.readTree(body);
                if (jsonNode.has("error")) {
                    throw HttpClientErrorException.create(jsonNode.get("error_description").asText(), statusCode, response.getStatusText(), response.getHeaders(), body, getCharset(response));
                }
                else if (jsonNode.has("ret")) {
                    int ret = jsonNode.get("ret").asInt();
                    if (ret != 0) {
                        throw HttpClientErrorException.create(jsonNode.get("msg").asText(), statusCode, response.getStatusText(), response.getHeaders(), body, getCharset(response));
                    }
                }
            }
            else {
                super.handleError(response, statusCode);
            }
        }
        else {
            // 未知的HTTP错误码类型
            byte[] body = getResponseBody(response);
            String message = "Connect Server Error";
            throw new UnknownHttpStatusCodeException(message,
                response.getRawStatusCode(), response.getStatusText(),
                response.getHeaders(), body, getCharset(response));
        }
    }
}
