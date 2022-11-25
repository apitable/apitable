package com.apitable.starter.social.feishu.autoconfigure;

import javax.servlet.http.HttpServlet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.social.core.AppTicketStorage;
import com.vikadata.social.feishu.config.FeishuRedisOperations;
import com.vikadata.social.feishu.AppTicketEventCallbackHandler;
import com.vikadata.social.feishu.FeishuEventListenerManager;
import com.vikadata.social.feishu.FeishuServiceProvider;
import com.vikadata.social.feishu.config.AppTicketInRedisStorage;
import com.vikadata.social.feishu.config.ConfigInRedisStorage;
import com.vikadata.social.feishu.config.FeishuConfigStorage;
import com.vikadata.social.feishu.config.RedisTemplateFeishuRedisOperations;
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
import org.springframework.data.redis.core.StringRedisTemplate;

import static com.vikadata.social.core.StringUtil.fixBasePath;

/**
 * autoconfiguration of feishu api integration
 *
 * @author Shawn Deng
 */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(FeishuProperties.class)
@ConditionalOnClass({ RedisOperations.class, FeishuServiceProvider.class })
@ConditionalOnProperty(value = "vikadata-starter.social.feishu.enabled", havingValue = "true")
public class FeishuAutoConfiguration implements ApplicationContextAware, BeanDefinitionRegistryPostProcessor, BeanPostProcessor, EnvironmentAware {

    private static final Logger LOGGER = LoggerFactory.getLogger(FeishuAutoConfiguration.class);

    private static final String FEISHU_CONFIG_STORAGE_BEAN_NAME = "feishuConfigStorage";

    private static final String FEISHU_TICKET_STORAGE_BEAN_NAME = "feishuAppTicketStorage";

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

    @Bean
    @ConditionalOnMissingBean(FeishuRedisOperations.class)
    public FeishuRedisOperations socialRedisOperations(StringRedisTemplate stringRedisTemplate) {
        LOGGER.info("Register Social Redis Operation Bean");
        return new RedisTemplateFeishuRedisOperations(stringRedisTemplate);
    }

    @Bean(name = FEISHU_TICKET_STORAGE_BEAN_NAME)
    @ConditionalOnProperty(value = "vikadata-starter.social.feishu.isv", havingValue = "true")
    @ConditionalOnMissingBean(name = FEISHU_TICKET_STORAGE_BEAN_NAME)
    public AppTicketStorage appTicketStorage(FeishuRedisOperations feishuRedisOperations) {
        // init ticket storage instance only isv
        LOGGER.info("Register App Ticket Storage Bean");
        AppTicketInRedisStorage ticketStorage = new AppTicketInRedisStorage(feishuRedisOperations);
        ticketStorage.setAppId(properties.getAppId());
        ticketStorage.setAppSecret(properties.getAppSecret());
        return ticketStorage;
    }

    @Bean(name = FEISHU_CONFIG_STORAGE_BEAN_NAME)
    @ConditionalOnMissingBean(name = FEISHU_CONFIG_STORAGE_BEAN_NAME)
    @ConditionalOnProperty(prefix = "vikadata-starter.social.feishu", name = "app-id")
    public FeishuConfigStorage defaultConfigStorage(FeishuRedisOperations feishuRedisOperations) {
        LOGGER.info("Register Feishu Token Storage Bean");
        ConfigInRedisStorage configStorage = new ConfigInRedisStorage(feishuRedisOperations);
        configStorage.setAppId(properties.getAppId());
        configStorage.setAppSecret(properties.getAppSecret());
        configStorage.setIsv(properties.getIsv());
        configStorage.setEncryptKey(properties.getEncryptKey());
        configStorage.setVerificationToken(properties.getVerificationToken());
        return configStorage;
    }

    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) throws BeansException {
        BindResult<FeishuProperties> bind = Binder.get(environment).bind("vikadata-starter.social.feishu", Bindable.of(FeishuProperties.class));
        properties = bind.get();
        if (properties == null) {
            return;
        }
        // init instance
        FeishuServiceProvider serviceProvider = new FeishuServiceProvider();
        instance = serviceProvider;
        DefaultListableBeanFactory beanFactory = (DefaultListableBeanFactory) ((ConfigurableApplicationContext) applicationContext).getBeanFactory();
        beanFactory.registerSingleton(FeishuServiceProvider.class.getSimpleName(), serviceProvider);
        LOGGER.info("Provider Bean Name: {}", FeishuServiceProvider.class.getSimpleName());
    }

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        // nothing to do
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        if (bean instanceof AppTicketStorage && FEISHU_TICKET_STORAGE_BEAN_NAME.equals(beanName)) {
            // App Ticket storage instance
            AppTicketStorage ticketStorage = (AppTicketStorage) bean;
            if (properties.getIsv()) {
                instance.getFeishuTemplate().setTicketStorage(ticketStorage);
                instance.getEventListenerManager().registerEventCallbackHandler(AppTicketEvent.class, new AppTicketEventCallbackHandler(ticketStorage));
            }
        }
        if (bean instanceof FeishuConfigStorage && FEISHU_CONFIG_STORAGE_BEAN_NAME.equals(beanName)) {
            // Add the default application configuration memory, generally the store is isv configuration
            instance.getFeishuTemplate().setDefaultConfigStorage((FeishuConfigStorage) bean);
        }
        return bean;
    }

    @Bean
    public ServletRegistrationBean<HttpServlet> registerFeishuEvent() {
        FeishuServlet feishuServlet = new FeishuServlet();
        feishuServlet.setApplicationContext(applicationContext);
        ServletRegistrationBean<HttpServlet> servletRegistrationBean = new ServletRegistrationBean<>(
                feishuServlet,
                fixBasePath(this.properties.getBasePath()) + "/*"
        );
        servletRegistrationBean.setName("feishuServlet");
        return servletRegistrationBean;
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
            // print event list
            StringBuilder output = new StringBuilder(256);
            output.append("\n---------------- Feishu event List -----------------\n");
            manager.getEventHandlerMap().keySet().forEach(e -> output.append("Event:").append(e.getSimpleName()).append("\n"));
            manager.getV3ContactEventHandlerMap().keySet().forEach(e -> output.append("V3 Version Contact Event: ").append(e.getSimpleName()).append("\n"));
            output.append("---------------------------------------------------");
            LOGGER.info(output.toString());
        }
        // load config
        if (instance.getFeishuTemplate().getDefaultConfigStorage() != null) {
            FeishuConfigStorage configStorage = instance.getFeishuTemplate().getDefaultConfigStorage();
            if (configStorage.isv()) {
                LOGGER.info("Default Config is ISV, Trigger Ticket Resend");
                instance.getFeishuTemplate().prepareTicketConfig();
            }
        }

        LOGGER.info("Feishu Event initializing complete. Congratulations.....");
    }
}
