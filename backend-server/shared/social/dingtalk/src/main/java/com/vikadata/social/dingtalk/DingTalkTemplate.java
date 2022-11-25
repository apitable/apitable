package com.vikadata.social.dingtalk;

import java.util.HashMap;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;

import com.vikadata.social.core.ApiBinding;
import com.vikadata.social.core.AppTicketStorage;
import com.vikadata.social.core.ConfigStorage;
import com.vikadata.social.dingtalk.api.CorpAppOperations;
import com.vikadata.social.dingtalk.api.IsvAppOperations;
import com.vikadata.social.dingtalk.api.MobileAppOperations;
import com.vikadata.social.dingtalk.api.ServiceCorpAppOperations;
import com.vikadata.social.dingtalk.api.impl.CorpH5AppTemplate;
import com.vikadata.social.dingtalk.api.impl.IsvAppTemplate;
import com.vikadata.social.dingtalk.api.impl.MobileAppTemplate;
import com.vikadata.social.dingtalk.api.impl.ServiceCorpAppTemplate;

import org.springframework.http.HttpHeaders;
import org.springframework.http.client.BufferingClientHttpRequestFactory;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;

public class DingTalkTemplate extends ApiBinding implements DingTalk {

    private final DingtalkConfig dingTalkConfig;

    private CorpAppOperations corpH5AppOperations;

    private MobileAppOperations mobileAppOperations;

    private ServiceCorpAppOperations serviceCorpAppOperations;

    private IsvAppOperations isvAppOperations;

    private ConfigStorage configStorage;

    private HashMap<String, AppTicketStorage> suiteTicketStorage;

    public ConfigStorage getConfigStorage() {
        return configStorage;
    }

    public DingtalkConfig getDingTalkConfig() {
        return dingTalkConfig;
    }

    public void setConfigStorage(ConfigStorage configStorage) {
        this.configStorage = configStorage;
    }

    public void setSuiteTicketStorage(HashMap<String, AppTicketStorage> suiteTicketStorage) {
        this.suiteTicketStorage = suiteTicketStorage;
    }

    public DingTalkTemplate(DingtalkConfig dingTalkConfig) {
        this.dingTalkConfig = dingTalkConfig;
    }

    public void initAppApis() {
        // The mobile app does not need to store the token
        mobileAppOperations = new MobileAppTemplate(getRestTemplate(), dingTalkConfig);
        corpH5AppOperations = new CorpH5AppTemplate(getRestTemplate(), dingTalkConfig, configStorage);
        serviceCorpAppOperations = new ServiceCorpAppTemplate(getRestTemplate(), dingTalkConfig, configStorage);
        isvAppOperations = new IsvAppTemplate(getRestTemplate(), dingTalkConfig, configStorage, suiteTicketStorage);
    }

    @Override
    public CorpAppOperations corpAppOperations() {
        return corpH5AppOperations;
    }

    @Override
    public MobileAppOperations mobileAppOperations() {
        return mobileAppOperations;
    }

    @Override
    public ServiceCorpAppOperations serviceCorpAppOperations() {
        return serviceCorpAppOperations;
    }

    @Override
    public IsvAppOperations isvAppOperations() {
        if (isvAppOperations == null) {
            throw new IllegalStateException("DingTalk isv app operation not find");
        }
        return isvAppOperations;
    }

    @Override
    protected MappingJackson2HttpMessageConverter getJsonMessageConverter() {
        // Configure message converters
        MappingJackson2HttpMessageConverter converter = super.getJsonMessageConverter();
        converter.getObjectMapper().setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
        converter.getObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return converter;
    }


    private void configureRestTemplate() {
        super.setRequestFactory(bufferRequestWrapper(getRestTemplate().getRequestFactory()));
        // Set up a request interceptor
        getRestTemplate().getInterceptors().add(userAgentInterceptor());
    }

    /**
     * The abstract base class has set the default request client factory, wraps the request again, and the response body stream can be read repeatedly
     * @param requestFactory Request factory
     * @return ClientHttpRequestFactory
     */
    private static ClientHttpRequestFactory bufferRequestWrapper(ClientHttpRequestFactory requestFactory) {
        return new BufferingClientHttpRequestFactory(requestFactory);
    }

    private ClientHttpRequestInterceptor userAgentInterceptor() {
        return (request, bytes, execution) -> {
            request.getHeaders().set(HttpHeaders.USER_AGENT, "VikaData");
            return execution.execute(request, bytes);
        };
    }
}
