package com.vikadata.api.config;

import java.util.Map;
import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;

import com.vikadata.api.holder.UserHolder;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.spring.task.VisibleThreadPoolTaskExecutor;
import com.vikadata.social.feishu.FeishuConfigStorageHolder;

import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.cloud.sleuth.instrument.async.LazyTraceExecutor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Role;
import org.springframework.context.i18n.LocaleContext;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.scheduling.annotation.AsyncAnnotationBeanPostProcessor;
import org.springframework.scheduling.annotation.AsyncConfigurerSupport;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

/**
 * <p>
 * Asynchronous Task Configuration
 * </p>
 *
 * @author Shawn Deng
 */
@Configuration(proxyBeanMethods = false)
@EnableAsync
@Slf4j
@Role(BeanDefinition.ROLE_INFRASTRUCTURE)
public class AsyncTaskExecutorConfig extends AsyncConfigurerSupport {

    public static final String DEFAULT_EXECUTOR_BEAN_NAME =
            AsyncAnnotationBeanPostProcessor.DEFAULT_TASK_EXECUTOR_BEAN_NAME;

    private final BeanFactory beanFactory;

    public AsyncTaskExecutorConfig(BeanFactory beanFactory) {
        this.beanFactory = beanFactory;
    }

    @Override
    @Bean(name = DEFAULT_EXECUTOR_BEAN_NAME)
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new VisibleThreadPoolTaskExecutor();
        executor.setCorePoolSize(4);
        executor.setMaxPoolSize(50);
        executor.setQueueCapacity(500);
        executor.setKeepAliveSeconds(3000);
        executor.setThreadNamePrefix("vika-task-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.setTaskDecorator(runnable -> {
            RequestAttributes context = RequestContextHolder.getRequestAttributes();
            LocaleContext localeContext = LocaleContextHolder.getLocaleContext();
            Map<String, String> mdcContext = MDC.getCopyOfContextMap();
            return () -> {
                try {
                    RequestContextHolder.setRequestAttributes(context);
                    LocaleContextHolder.setLocaleContext(localeContext, true);
                    if (mdcContext != null) {
                        MDC.setContextMap(mdcContext);
                    }
                    // execute asynchronous tasks
                    runnable.run();
                }
                catch (Exception ex) {
                    if (!(ex instanceof BusinessException)) {
                        log.error("Manual execution of asynchronous task exception.", ex);
                    }
                    throw ex;
                }
                finally {
                    log.info("Reset asynchronous thread variables");
                    MDC.clear();
                    RequestContextHolder.resetRequestAttributes();
                    LocaleContextHolder.resetLocaleContext();
                    FeishuConfigStorageHolder.remove();
                    UserHolder.remove();
                }
            };
        });
        executor.initialize();
        return new LazyTraceExecutor(beanFactory, executor);
    }

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (ex, method, params) -> {
            if (!(ex instanceof BusinessException)) {
                log.error("Annotate asynchronous task exceptions and clean up asynchronous thread variables.", ex);
            }
            FeishuConfigStorageHolder.remove();
            UserHolder.remove();
        };
    }
}
