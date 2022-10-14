package com.vikadata.boot.autoconfigure.social;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServlet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.boot.autoconfigure.social.DingTalkProperties.AgentAppProperty;
import com.vikadata.boot.autoconfigure.social.DingTalkProperties.IsvAppProperty;
import com.vikadata.boot.autoconfigure.social.dingtalk.DingTalkEventScanner;
import com.vikadata.social.core.AppTicketStorage;
import com.vikadata.social.core.ConfigStorage;
import com.vikadata.social.dingtalk.CheckCreateSuiteUrlEventCallbackHandler;
import com.vikadata.social.dingtalk.CheckUpdateSuiteUrlEventCallbackHandler;
import com.vikadata.social.dingtalk.CheckUrlEventCallbackHandler;
import com.vikadata.social.dingtalk.DingTalkEventListenerManager;
import com.vikadata.social.dingtalk.DingTalkServiceProvider;
import com.vikadata.social.dingtalk.DingTalkTemplate;
import com.vikadata.social.dingtalk.DingtalkConfig;
import com.vikadata.social.dingtalk.DingtalkConfig.AgentApp;
import com.vikadata.social.dingtalk.DingtalkConfig.IsvApp;
import com.vikadata.social.dingtalk.EventListenerFactory;
import com.vikadata.social.dingtalk.SuiteTicketEventCallbackHandler;
import com.vikadata.social.dingtalk.config.AccessTokenInRedisStorage;
import com.vikadata.social.dingtalk.config.DingTalkConfigInRedisStorage;
import com.vikadata.social.dingtalk.config.DingTalkConfigStorage;
import com.vikadata.social.dingtalk.config.DingTalkRedisOperations;
import com.vikadata.social.dingtalk.config.RedisTemplateDingTalkOperations;
import com.vikadata.social.dingtalk.config.SuiteTicketInRedisStorage;
import com.vikadata.social.dingtalk.event.CheckCreateSuiteUrlEvent;
import com.vikadata.social.dingtalk.event.CheckUpdateSuiteUrlEvent;
import com.vikadata.social.dingtalk.event.CheckUrlEvent;
import com.vikadata.social.dingtalk.event.sync.http.SuiteTicketEvent;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.BeanDefinitionRegistryPostProcessor;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.context.properties.bind.BindResult;
import org.springframework.boot.context.properties.bind.Bindable;
import org.springframework.boot.context.properties.bind.Binder;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.EnvironmentAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.lang.NonNull;

/**
 * <p>
 * 钉钉组件自动配置
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/9/17 15:39
 */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(DingTalkProperties.class)
@ConditionalOnClass(DingTalkServiceProvider.class)
@ConditionalOnProperty(value = "vikadata-starter.social.dingtalk.enabled", havingValue = "true")
public class DingTalkAutoConfiguration implements ApplicationContextAware, BeanDefinitionRegistryPostProcessor,
        BeanPostProcessor, EnvironmentAware {
    private static final String SLASH = "/";

    private static final String DINGTALK_CONFIG_STORAGE_BEAN_NAME = "dingtalkConfigStorage";

    private static final String DINGTALK_SUITE_TICKET_STORAGE_BEAN_NAME = "dingtalkSuiteTicketStorage";

    private static final Logger LOGGER = LoggerFactory.getLogger(DingTalkAutoConfiguration.class);

    private DingTalkProperties properties;

    private DingTalkServiceProvider instance;

    private Environment environment;

    private ApplicationContext applicationContext;

    @Override
    public void setEnvironment(@NonNull Environment environment) {
        this.environment = environment;
    }

    @Override
    public void setApplicationContext(@NonNull ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    @Bean(name = DINGTALK_CONFIG_STORAGE_BEAN_NAME)
    @ConditionalOnMissingBean(name = DINGTALK_CONFIG_STORAGE_BEAN_NAME)
    public ConfigStorage dingtalkConfigStorage(DingTalkRedisOperations dingTalkRedisOperations) {
        LOGGER.info("Register Dingtalk Access Token Storage Bean");
        return new AccessTokenInRedisStorage(dingTalkRedisOperations, "vikadata");
    }

    @Bean(name = DINGTALK_SUITE_TICKET_STORAGE_BEAN_NAME)
    @ConditionalOnMissingBean(name = DINGTALK_SUITE_TICKET_STORAGE_BEAN_NAME)
    public HashMap<String, AppTicketStorage> suiteTicketStorage(DingTalkRedisOperations dingTalkRedisOperations) {
        LOGGER.info("Register DingTalk Suite Ticket Storage Bean");
        List<IsvAppProperty> isvAppList = properties.getIsvAppList();
        HashMap<String, AppTicketStorage> ticketStorageMap = new HashMap<>(isvAppList.size());
        isvAppList.forEach(item -> {
            SuiteTicketInRedisStorage ticketStorage = new SuiteTicketInRedisStorage(dingTalkRedisOperations, "vikadata");
            ticketStorage.setTicketKey(item.getSuiteId(), properties.getIsvCorpId());
            ticketStorageMap.put(item.getSuiteId(), ticketStorage);
        });
        return ticketStorageMap;
    }

    @Bean
    @ConditionalOnMissingBean(name = "dingTalkRedisOperations")
    public DingTalkRedisOperations dingTalkRedisOperations(StringRedisTemplate stringRedisTemplate,
            RedisTemplate<String, Object> redisTemplate) {
        LOGGER.info("Register DingTalk Redis Operation Bean");
        return new RedisTemplateDingTalkOperations(stringRedisTemplate, redisTemplate);
    }

    @Bean
    @ConditionalOnMissingBean(name = "dingTalkConfigStorage")
    public DingTalkConfigStorage dingTalkConfigStorage(DingTalkRedisOperations dingTalkRedisOperations) {
        LOGGER.info("Register DingTalk Config Storage Bean");
        return new DingTalkConfigInRedisStorage(dingTalkRedisOperations, "vikadata");
    }

    @Override
    public void postProcessBeanDefinitionRegistry(@NonNull BeanDefinitionRegistry registry) throws BeansException {
        //BEAN实例化之前，动态注册BEAN
        // 这时候钉钉配置还没实例化完成，获取配置信息
        BindResult<DingTalkProperties> bind = Binder.get(environment).bind("vikadata-starter.social.dingtalk", Bindable.of(DingTalkProperties.class));
        properties = bind.get();
        if (properties == null) {
            return;
        }
        // 配置检查
        DingTalkProperties.checkAppProperties(properties);
        // SDK 配置
        DingtalkConfig dingtalkConfig = applyProperties();
        // 实例化服务类入口
        DingTalkServiceProvider serviceProvider = new DingTalkServiceProvider(dingtalkConfig);
        instance = serviceProvider;
        // 注册BEAN
        DefaultListableBeanFactory beanFactory = (DefaultListableBeanFactory) ((ConfigurableApplicationContext) applicationContext).getBeanFactory();
        beanFactory.registerSingleton(DingTalkServiceProvider.class.getSimpleName(), serviceProvider);
        LOGGER.info("DingTalk Provider Bean Name: {}", DingTalkServiceProvider.class.getSimpleName());
        beanFactory.registerSingleton(DingTalkTemplate.class.getSimpleName(), serviceProvider.getDingTalkTemplate());
        LOGGER.info("DingTalk Template Bean Name: {}", DingTalkTemplate.class.getSimpleName());
    }

    @Override
    public void postProcessBeanFactory(@NonNull ConfigurableListableBeanFactory beanFactory) throws BeansException {
        // BEAN实例化之前，修改BEAN的属性
    }

    @Override
    public Object postProcessAfterInitialization(@NonNull Object bean, @NonNull String beanName) throws BeansException {
        if (DINGTALK_SUITE_TICKET_STORAGE_BEAN_NAME.equals(beanName)) {
            // App Ticket 存储实例
            HashMap<String, AppTicketStorage> ticketStorage = (HashMap<String, AppTicketStorage>) bean;
            if (!properties.getIsvAppList().isEmpty()) {
                instance.setSuiteTicketStorage(ticketStorage);
                instance.getEventListenerManager().registerEventCallbackHandler(SuiteTicketEvent.class,
                        new SuiteTicketEventCallbackHandler(ticketStorage));
                instance.getEventListenerManager().registerEventCallbackHandler(CheckUrlEvent.class,
                        new CheckUrlEventCallbackHandler());
                instance.getEventListenerManager().registerEventCallbackHandler(CheckCreateSuiteUrlEvent.class,
                        new CheckCreateSuiteUrlEventCallbackHandler());
                instance.getEventListenerManager().registerEventCallbackHandler(CheckUpdateSuiteUrlEvent.class,
                        new CheckUpdateSuiteUrlEventCallbackHandler());
            }
        }
        // BEAN已经实例化完成，可读取容器的所有BEAN,并设置属性
        if (bean instanceof ConfigStorage && DINGTALK_CONFIG_STORAGE_BEAN_NAME.equals(beanName)) {
            // Token 管理存储实例
            instance.setConfigStorage((ConfigStorage) bean);
        }

        if (bean instanceof DingTalkConfigStorage) {
            DingTalkConfigStorage agentAppStorage = (DingTalkConfigStorage) bean;
            instance.getDingtalkConfig().setAgentAppStorage(agentAppStorage);
            if (!properties.getAgentApp().isEmpty()) {
                for (AgentAppProperty appInfo : properties.getAgentApp()) {
                    if (!agentAppStorage.hasAgentApp(appInfo.getAgentId())) {
                        AgentApp agentApp = new AgentApp();
                        agentApp.setAgentId(appInfo.getAgentId());
                        agentApp.setCustomKey(appInfo.getCustomKey());
                        agentApp.setCustomSecret(appInfo.getCustomSecret());
                        agentApp.setToken(appInfo.getToken());
                        agentApp.setAesKey(appInfo.getAesKey());
                        agentApp.setCorpId(appInfo.getCorpId());
                        agentApp.setSuiteTicket(appInfo.getSuiteTicket());
                        agentAppStorage.setAgentApp(agentApp);
                    }
                }
            }
        }
        return bean;
    }


    @Bean
    public ServletRegistrationBean<HttpServlet> registerDingTalkApi() {
        DingTalkServlet dingTalkServlet = new DingTalkServlet();
        dingTalkServlet.setApplicationContext(applicationContext);
        ServletRegistrationBean<HttpServlet> servletRegistrationBean = new ServletRegistrationBean<>(
                dingTalkServlet,
                fixBasePath(properties.getBasePath()) + fixBasePath(properties.getEventPath()) + "/*",
                fixBasePath(properties.getBasePath()) + fixBasePath(properties.getSyncEventPath()) + "/*"
        );
        servletRegistrationBean.setName("DingTalkServlet");
        return servletRegistrationBean;
    }

    @EventListener(ApplicationStartedEvent.class)
    public void onDingTalkEventListenerScan() {
        LOGGER.info("Starting scan ding talk event");
        DingTalkEventScanner scanner = new DingTalkEventScanner(applicationContext);
        EventListenerFactory factory = scanner.scan();

        DingTalkEventListenerManager manager = instance.getEventListenerManager();
        factory.getEventHandlerMap().forEach(manager::registerEventCallbackHandler);
        if (LOGGER.isInfoEnabled()) {
            // 预览事件列表
            StringBuilder output = new StringBuilder(256);
            output.append("\n---------------- 已开通的钉钉事件订阅 -----------------\n");
            manager.getEventHandlerMap().keySet().forEach(e -> output.append("Event Name:").append(e.getSimpleName()).append("\n"));
            output.append("---------------------------------------------------");
            LOGGER.info(output.toString());
        }
        // 初始化入口类，没错误的话，恭喜钉钉服务启动成功
        instance.init();
        LOGGER.info("Ding talk Event initializing complete. Congratulations.....");
    }

    private String fixBasePath(String path) {

        String basePath = path;
        // 不能设置为根路径请求，以免影响应用
        if (SLASH.equals(basePath)) {
            throw new IllegalStateException("不能设置为根路径 /，恐怕会影响您的业务应用接口造成没必要的错误: " + path);
        }

        // 移除后缀重复的 / 符号
        while (basePath.endsWith(SLASH)) {
            basePath = basePath.substring(0, basePath.length() - 1);
        }

        if (basePath.length() == 0) {
            throw new IllegalStateException("您未设置应用请求基础路径，请设置vikadata-starter.social.dingtalk.base-path = : " + path);
        }

        // 前缀补齐
        if (!basePath.startsWith(SLASH)) {
            basePath = SLASH + basePath;
        }

        return basePath;
    }

    private DingtalkConfig applyProperties() {
        DingtalkConfig config = new DingtalkConfig();
        config.setIsvCorpId(properties.getIsvCorpId());
        config.setSuiteId(properties.getSuiteId());
        config.setSuiteKey(properties.getSuiteKey());
        config.setSuiteSecret(properties.getSuiteSecret());
        config.setCorpSecret(properties.getCorpSecret());

        if (null != properties.getMobileApp()) {
            DingtalkConfig.Mobile mobileAppConfig = new DingtalkConfig.Mobile();
            mobileAppConfig.setAppId(properties.getMobileApp().getAppId());
            mobileAppConfig.setAppSecret(properties.getMobileApp().getAppSecret());
            config.setMobile(mobileAppConfig);
        }

        if (null != properties.getCorpH5App()) {
            DingtalkConfig.H5app h5appConfig = new DingtalkConfig.H5app();
            h5appConfig.setAppKey(properties.getCorpH5App().getAppKey());
            h5appConfig.setAppSecret(properties.getCorpH5App().getAppSecret());
            config.setH5app(h5appConfig);
        }

        if (!properties.getIsvAppList().isEmpty()) {
            HashMap<String, IsvApp> isvAppMap = new HashMap<>(properties.getIsvAppList().size());
            for (IsvAppProperty isvAppProperty : properties.getIsvAppList()) {
                IsvApp isvApp = new IsvApp();
                isvApp.setToken(isvAppProperty.getToken());
                isvApp.setSuiteKey(isvAppProperty.getSuiteKey());
                isvApp.setAesKey(isvAppProperty.getAesKey());
                isvApp.setSuiteSecret(isvAppProperty.getSuiteSecret());
                isvApp.setSuiteId(isvAppProperty.getSuiteId());
                isvAppMap.put(isvAppProperty.getSuiteId(), isvApp);
            }
            config.setIsvAppMap(isvAppMap);
        }
        return config;
    }
}
