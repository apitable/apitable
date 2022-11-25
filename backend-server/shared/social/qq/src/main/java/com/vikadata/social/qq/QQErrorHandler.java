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
 * QQ Open platform call exception handling
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
                // Parse the response body and determine whether the return is successful
                byte[] body = getResponseBody(response);
                JsonNode jsonNode = objectMapper.readTree(body);
                // The results of QQ's oauth2 and getUserInfo are not the same, and must be distinguished for
                // analysis and judgment
                if (jsonNode.has("error")) {
                    // oauth2 interface call failed
                    logger.error("QQ Authorization error:" + jsonNode.get("error") + ", description: " + jsonNode.get("error_description"));
                    return true;
                }
                else if (jsonNode.has("ret")) {
                    // getUserInfo interface
                    int ret = jsonNode.get("ret").asInt();
                    if (ret != 0) {
                        logger.error("QQ get user info error, return code: " + jsonNode.get("ret") + ", message: " + jsonNode.get("msg"));
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
                // The error inherited from the custom parsing of the has Error() method above, the HTTP status code is still 200 success
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
            // Unknown HTTP error code type
            byte[] body = getResponseBody(response);
            String message = "Connect Server Error";
            throw new UnknownHttpStatusCodeException(message,
                    response.getRawStatusCode(), response.getStatusText(),
                    response.getHeaders(), body, getCharset(response));
        }
    }
}
