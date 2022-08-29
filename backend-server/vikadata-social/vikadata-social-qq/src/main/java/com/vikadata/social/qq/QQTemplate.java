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
 * QQ 开放平台接口实现
 *
 * @author Shawn Deng
 * @date 2021-01-11 18:27:24
 */
public class QQTemplate extends ApiBinding implements QQ {

    private AuthOperations authOperations;

    public QQTemplate(AppConfig appConfig) {
        configureRestTemplate();
        this.authOperations = new AuthTemplate(appConfig, getRestTemplate());
    }

    private void configureRestTemplate() {
        super.setRequestFactory(bufferRequestWrapper(getRestTemplate().getRequestFactory()));
        // 设置请求拦截器
        getRestTemplate().getInterceptors().add(userAgentInterceptor());
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setSupportedMediaTypes(Arrays.asList(MediaType.TEXT_HTML, MediaType.TEXT_PLAIN));
        getRestTemplate().getMessageConverters().add(converter);
        // 响应结果错误自定义拦截
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
        // 可自定义工厂类
        super.setRequestFactory(bufferRequestWrapper(requestFactory));
    }

    @Override
    protected MappingJackson2HttpMessageConverter getJsonMessageConverter() {
        // 配置消息转换器
        MappingJackson2HttpMessageConverter converter = super.getJsonMessageConverter();
        // 飞书的所有API请求参数都是下划线格式,而响应结构的属性也是下划线
        converter.getObjectMapper().setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
        converter.getObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return converter;
    }

    /**
     * 抽象基类已经设置默认的请求客户端工厂，再次包装请求，响应体流可重复读取
     *
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
