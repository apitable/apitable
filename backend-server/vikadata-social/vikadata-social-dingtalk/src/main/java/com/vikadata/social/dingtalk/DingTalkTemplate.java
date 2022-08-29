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

/**
 * 钉钉服务接口
 *
 * @author Shawn Deng
 * @date 2021-01-07 14:45:07
 */
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
        // 移动端不需要存储token
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
            throw new IllegalStateException("第三方应用接口为定义");
        }
        return isvAppOperations;
    }

    @Override
    protected MappingJackson2HttpMessageConverter getJsonMessageConverter() {
        // 配置消息转换器
        MappingJackson2HttpMessageConverter converter = super.getJsonMessageConverter();
        // 参数都是下划线格式,而响应结构的属性也是下划线
        converter.getObjectMapper().setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
        converter.getObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return converter;
    }


    private void configureRestTemplate() {
        super.setRequestFactory(bufferRequestWrapper(getRestTemplate().getRequestFactory()));
        // 设置请求拦截器
        getRestTemplate().getInterceptors().add(userAgentInterceptor());
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

    private ClientHttpRequestInterceptor userAgentInterceptor() {
        return (request, bytes, execution) -> {
            request.getHeaders().set(HttpHeaders.USER_AGENT, "VikaData");
            return execution.execute(request, bytes);
        };
    }
}
