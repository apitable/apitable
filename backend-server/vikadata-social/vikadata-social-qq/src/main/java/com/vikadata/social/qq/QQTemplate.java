package com.vikadata.social.qq;

import java.util.Arrays;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;

import com.vikadata.social.core.ApiBinding;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.BufferingClientHttpRequestFactory;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;

/**
 * QQ Open platform interface implementation=
 */
public class QQTemplate extends ApiBinding implements QQ {

    private AuthOperations authOperations;

    public QQTemplate(AppConfig appConfig) {
        configureRestTemplate();
        this.authOperations = new AuthTemplate(appConfig, getRestTemplate());
    }

    private void configureRestTemplate() {
        super.setRequestFactory(bufferRequestWrapper(getRestTemplate().getRequestFactory()));
        // Set up a request interceptor
        getRestTemplate().getInterceptors().add(userAgentInterceptor());
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setSupportedMediaTypes(Arrays.asList(MediaType.TEXT_HTML, MediaType.TEXT_PLAIN));
        getRestTemplate().getMessageConverters().add(converter);
        // Response result error custom interception
        getRestTemplate().setErrorHandler(new QQErrorHandler());
    }

    private ClientHttpRequestInterceptor userAgentInterceptor() {
        return (request, bytes, execution) -> {
            request.getHeaders().set(HttpHeaders.USER_AGENT, "VIKA_QQ");
            return execution.execute(request, bytes);
        };
    }

    @Override
    public void setRequestFactory(ClientHttpRequestFactory requestFactory) {
        // Customizable factory class
        super.setRequestFactory(bufferRequestWrapper(requestFactory));
    }

    @Override
    protected MappingJackson2HttpMessageConverter getJsonMessageConverter() {
        // Configure message converters
        MappingJackson2HttpMessageConverter converter = super.getJsonMessageConverter();
        // All API request parameters of Feishu are in underlined format, and the attributes of the response structure are also underlined
        converter.getObjectMapper().setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
        converter.getObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return converter;
    }

    /**
     * The abstract base class has set the default request client factory, wraps the request again,
     * and the response body stream can be read repeatedly
     * @param requestFactory Request factory
     * @return ClientHttpRequestFactory
     */
    private static ClientHttpRequestFactory bufferRequestWrapper(ClientHttpRequestFactory requestFactory) {
        return new BufferingClientHttpRequestFactory(requestFactory);
    }

    @Override
    public AuthOperations authOperations() {
        return authOperations;
    }
}
