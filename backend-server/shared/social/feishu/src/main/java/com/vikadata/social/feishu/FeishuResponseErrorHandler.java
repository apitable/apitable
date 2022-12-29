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
 * Feishu request failure interception handler.
 * Generally, it means that the http status response is abnormal, and it is not 200 abnormal.
 * Feishu's error exceptions are all custom response body content {@code content: {code: 9999, msg: 'need a token'} },
 * you need to extract the msg in the error message by yourself
 */
public class FeishuResponseErrorHandler extends DefaultResponseErrorHandler {

    private final static Logger LOGGER = LoggerFactory.getLogger(FeishuResponseErrorHandler.class);

    @Override
    protected void handleError(ClientHttpResponse response, HttpStatus statusCode) throws IOException {
        // Status code exists, additional processing does not throw Rest Client Exception
        try {
            ObjectMapper mapper = new ObjectMapper(new JsonFactory());
            String body = getBodyAsString(response.getBody());
            JsonNode jsonNode = mapper.readValue(body, JsonNode.class);
            Integer code = jsonNode.has("code") ? jsonNode.get("code").intValue() : null;
            String message = jsonNode.has("msg") ? jsonNode.get("msg").asText() : null;
            FeishuError error = new FeishuError(code, message);
            boolean isIgnore = error.getCode().equals(FeishuErrorCode.NO_DEPT_AUTHORITY_ERROR);
            if (!isIgnore) {
                LOGGER.error("Calling feishu API error,is it possible to ignore errors[{}],HTTP status code:[{}],"
                                + "business error code:[{}],business error message:[{}],response header: \n{}",
                        false, response.getRawStatusCode(),
                        error.getCode(), error.getMsg(), response.getHeaders());
            }

            throw new FeishuApiException(error.getCode(), error.getMsg());
        }
        catch (JsonParseException e) {
            LOGGER.error("Failed to parse Feishu response body", e);
            throw new RuntimeException("Failed to parse Feishu response body");
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
