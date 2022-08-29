package com.vikadata.social.core;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.OkHttp3ClientHttpRequestFactory;
import org.springframework.http.converter.ByteArrayHttpMessageConverter;
import org.springframework.http.converter.FormHttpMessageConverter;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.ResourceHttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

/**
 * 通用开放平台API抽象基础类
 *
 * @author Shawn Deng
 * @date 2020-11-19 12:29:48
 */
public abstract class ApiBinding {

    private final RestTemplate restTemplate;

    public ApiBinding() {
        this.restTemplate = createRestTemplateWithDefaultMessageConverters();
    }

    protected RestTemplate getRestTemplate() {
        return restTemplate;
    }

    public void setRequestFactory(ClientHttpRequestFactory requestFactory) {
        restTemplate.setRequestFactory(requestFactory);
    }

    private RestTemplate createRestTemplateWithDefaultMessageConverters() {
        RestTemplate client;
        List<HttpMessageConverter<?>> messageConverters = getMessageConverters();
        try {
            client = new RestTemplate(messageConverters);
        }
        catch (NoSuchMethodError e) {
            client = new RestTemplate();
            client.setMessageConverters(messageConverters);
        }
        client.setRequestFactory(new OkHttp3ClientHttpRequestFactory());
        return client;
    }

    protected List<HttpMessageConverter<?>> getMessageConverters() {
        List<HttpMessageConverter<?>> messageConverters = new ArrayList<>();
        messageConverters.add(getStringHttpMessageConverter());
        messageConverters.add(getFormMessageConverter());
        messageConverters.add(getJsonMessageConverter());
        messageConverters.add(getByteArrayMessageConverter());
        return messageConverters;
    }

    protected StringHttpMessageConverter getStringHttpMessageConverter() {
        return new StringHttpMessageConverter();
    }

    protected FormHttpMessageConverter getFormMessageConverter() {
        FormHttpMessageConverter converter = new FormHttpMessageConverter();
        converter.setCharset(StandardCharsets.UTF_8);
        List<HttpMessageConverter<?>> partConverters = new ArrayList<>();
        partConverters.add(new ByteArrayHttpMessageConverter());
        StringHttpMessageConverter stringHttpMessageConverter = new StringHttpMessageConverter(StandardCharsets.UTF_8);
        stringHttpMessageConverter.setWriteAcceptCharset(false);
        partConverters.add(stringHttpMessageConverter);
        partConverters.add(new ResourceHttpMessageConverter());
        converter.setPartConverters(partConverters);
        return converter;
    }

    protected MappingJackson2HttpMessageConverter getJsonMessageConverter() {
        return new MappingJackson2HttpMessageConverter();
    }

    protected ByteArrayHttpMessageConverter getByteArrayMessageConverter() {
        ByteArrayHttpMessageConverter converter = new ByteArrayHttpMessageConverter();
        converter.setSupportedMediaTypes(Arrays.asList(MediaType.IMAGE_JPEG, MediaType.IMAGE_GIF, MediaType.IMAGE_PNG));
        return converter;
    }
}
