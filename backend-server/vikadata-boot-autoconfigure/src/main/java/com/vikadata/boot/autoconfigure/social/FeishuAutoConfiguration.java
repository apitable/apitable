package com.vikadata.boot.autoconfigure.social;

import javax.servlet.http.HttpServlet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.boot.autoconfigure.social.feishu.EventListenerFactory;
import com.vikadata.boot.autoconfigure.social.feishu.FeishuEventScanner;
import com.vikadata.social.core.AppTicketStorage;
import com.vikadata.social.core.SocialRedisOperations;
import com.vikadata.social.feishu.AppTicketEventCallbackHandler;
import com.vikadata.social.feishu.FeishuEventListenerManager;
import com.vikadata.social.feishu.FeishuServiceProvider;
import com.vikadata.social.feishu.config.AppTicketInRedisStorage;
import com.vikadata.social.feishu.config.ConfigInRedisStorage;
import com.vikadata.social.feishu.config.FeishuConfigStorage;
import com.vikadata.social.feishu.event.app.AppTicketEvent;

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
import org.springframework.data.redis.core.RedisOperations;

/**
 * 飞书 自动配置
 *
 * @author Shawn Deng
 * @date 2020-11-18 18:18:14
 */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(FeishuProperties.class)
@ConditionalOnClass({ RedisOperations.class, FeishuServiceProvider.class })
@ConditionalOnProperty(value = "vikadata-starter.social.feishu.enabled", havingValue = "true")
public class FeishuAutoConfiguration implements ApplicationContextAware, BeanDefinitionRegistryPostProcessor, BeanPostProcessor, EnvironmentAware {

    private static final Logger LOGGER = LoggerFactory.getLogger(FeishuAutoConfiguration.class);

    private static final String FEISHU_CONFIG_STORAGE_BEAN_NAME = "feishuConfigStorage";

    private static final String FEISHU_TICKET_STORAGE_BEAN_NAME = "feishuAppTicketStorage";

    private static final String SLASH = "/";

    private Environment environment;

    private ApplicationContext applicationContext;

    private FeishuProperties properties;

    private FeishuServiceProvider instance;

    @Override
    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    @Bean(name = FEISHU_TICKET_STORAGE_BEAN_NAME)
    @ConditionalOnProperty(value = "vikadata-starter.social.feishu.isv", havingValue = "true")
    @ConditionalOnMissingBean(name = FEISHU_TICKET_STORAGE_BEAN_NAME)
    public AppTicketStorage appTicketStorage(SocialRedisOperations socialRedisOperations) {
        // 只有配置了ISV应用才会初始化票据存储器
        LOGGER.info("Register App Ticket Storage Bean");
        AppTicketInRedisStorage ticketStorage = new AppTicketInRedisStorage(socialRedisOperations);
        ticketStorage.setAppId(properties.getAppId());
        ticketStorage.setAppSecret(properties.getAppSecret());
        return ticketStorage;
    }

    @Bean(name = FEISHU_CONFIG_STORAGE_BEAN_NAME)
    @ConditionalOnMissingBean(name = FEISHU_CONFIG_STORAGE_BEAN_NAME)
    @ConditionalOnProperty(prefix = "vikadata-starter.social.feishu", name = "app-id")
    public FeishuConfigStorage defaultConfigStorage(SocialRedisOperations socialRedisOperations) {
        // 这是默认应用配置存储器
        LOGGER.info("Register Feishu Token Storage Bean");
        ConfigInRedisStorage configStorage = new ConfigInRedisStorage(socialRedisOperations);
        configStorage.setAppId(properties.getAppId());
        configStorage.setAppSecret(properties.getAppSecret());
        configStorage.setIsv(properties.getIsv());
        configStorage.setEncryptKey(properties.getEncryptKey());
        configStorage.setVerificationToken(properties.getVerificationToken());
        return configStorage;
    }

    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) throws BeansException {
        // BEAN实例化之前，动态注册BEAN
        // 这时候飞书的配置还没实例化完成，获取配置信息
        BindResult<FeishuProperties> bind = Binder.get(environment).bind("vikadata-starter.social.feishu", Bindable.of(FeishuProperties.class));
        properties = bind.get();
        if (properties == null) {
            return;
        }
        // 实例化服务类入口
        FeishuServiceProvider serviceProvider = new FeishuServiceProvider();
        instance = serviceProvider;
        // 注册飞书服务提供者Bean
        DefaultListableBeanFactory beanFactory = (DefaultListableBeanFactory) ((ConfigurableApplicationContext) applicationContext).getBeanFactory();
        beanFactory.registerSingleton(FeishuServiceProvider.class.getSimpleName(), serviceProvider);
        LOGGER.info("Provider Bean Name: {}", FeishuServiceProvider.class.getSimpleName());
    }

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        // BEAN实例化之前，修改BEAN的属性
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        // BEAN已经实例化完成，可读取容器的所有BEAN,并设置属性
        if (bean instanceof AppTicketStorage && FEISHU_TICKET_STORAGE_BEAN_NAME.equals(beanName)) {
            // App Ticket 存储实例
            AppTicketStorage ticketStorage = (AppTicketStorage) bean;
            if (properties.getIsv()) {
                instance.getFeishuTemplate().setTicketStorage(ticketStorage);
                instance.getEventListenerManager().registerEventCallbackHandler(AppTicketEvent.class, new AppTicketEventCallbackHandler(ticketStorage));
            }
        }
        if (bean instanceof FeishuConfigStorage && FEISHU_CONFIG_STORAGE_BEAN_NAME.equals(beanName)) {
            // 添加默认的应用配置存储器，一般是商店应用配置
            instance.getFeishuTemplate().setDefaultConfigStorage((FeishuConfigStorage) bean);
        }
        return bean;
    }

    @Bean
    public ServletRegistrationBean<HttpServlet> registerFeishuEvent() {
        // 注册飞书事件订阅入口，接收事件并处理
        FeishuServlet feishuServlet = new FeishuServlet();
        feishuServlet.setApplicationContext(applicationContext);
        ServletRegistrationBean<HttpServlet> servletRegistrationBean = new ServletRegistrationBean<>(
                feishuServlet,
                fixBasePath(this.properties.getBasePath()) + "/*"
        );
        servletRegistrationBean.setName("feishuServlet");
        return servletRegistrationBean;
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
            throw new IllegalStateException("您未设置应用请求基础路径，请设置vikadata-starter.social.feishu.base-path = : " + path);
        }

        // 前缀补齐
        if (!basePath.startsWith(SLASH)) {
            basePath = SLASH + basePath;
        }

        return basePath;
    }

    @EventListener(ApplicationStartedEvent.class)
    public void onFeishuEventListenerScan() {
        LOGGER.info("Starting scan feishu event");
        FeishuEventScanner scanner = new FeishuEventScanner(this.applicationContext);
        EventListenerFactory factory = scanner.scan();
        FeishuEventListenerManager manager = instance.getEventListenerManager();
        factory.getEventHandlerMap().forEach(manager::registerEventCallbackHandler);
        factory.getV3ContactEventHandlerMap().forEach(manager::registerV3ContactEventCallbackHandler);
        manager.registerCardActionHandler(factory.getCardEventHandler());

        if (LOGGER.isDebugEnabled()) {
            // 预览事件列表
            StringBuilder output = new StringBuilder(256);
            output.append("\n---------------- 已开通的飞书商店应用事件订阅(1.0) -----------------\n");
            manager.getEventHandlerMap().keySet().forEach(e -> output.append("Event:").append(e.getSimpleName()).append("\n"));
            manager.getV3ContactEventHandlerMap().keySet().forEach(e -> output.append("V3 Version Contact Event: ").append(e.getSimpleName()).append("\n"));
            output.append("---------------------------------------------------");
            LOGGER.info(output.toString());
        }
        // 启动初始化加载配置
        if (instance.getFeishuTemplate().getDefaultConfigStorage() != null) {
            FeishuConfigStorage configStorage = instance.getFeishuTemplate().getDefaultConfigStorage();
            if (configStorage.isv()) {
                LOGGER.info("Default Config is ISV, Trigger Ticket Resend");
                instance.getFeishuTemplate().prepareTicketConfig();
            }
        }

        // 恭喜飞书服务事件订阅处理启动成功
        LOGGER.info("Feishu Event initializing complete. Congratulations.....");
    }
}
