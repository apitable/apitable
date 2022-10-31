package com.vikadata.social.service.dingtalk.config;

import java.util.Map;
import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;

import com.vikadata.core.spring.task.VisibleThreadPoolTaskExecutor;

import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.cloud.sleuth.instrument.async.LazyTraceExecutor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Role;
import org.springframework.scheduling.annotation.AsyncAnnotationBeanPostProcessor;
import org.springframework.scheduling.annotation.AsyncConfigurerSupport;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

/**
 * asynchronous task configuration,
 * thread pool encapsulated by spring framework
 * ROLE_INFRASTRUCTURE: Spring framework's own BEAN, which has nothing to do with the user
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
        log.info("Create async task thread pool");
        ThreadPoolTaskExecutor executor = new VisibleThreadPoolTaskExecutor();
        executor.setCorePoolSize(4);
        executor.setMaxPoolSize(50);
        executor.setQueueCapacity(500);
        executor.setKeepAliveSeconds(3000);
        executor.setThreadNamePrefix("vika-social-task-");
        // Thread pool's processing strategy for rejected tasks
        // rejection-policy: Refuse to process new tasks when the pool has reached max size
        // CALLER RUNS: The task is not executed in a new thread, but is executed by the thread where the caller is located
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        // The request context is put into the asynchronous thread, the asynchronous task context decorator
        //The asynchronous task is a separate thread, not with the servlet request thread, so the context of the main thread has to be passed over
        executor.setTaskDecorator(runnable -> {
            RequestAttributes context = RequestContextHolder.getRequestAttributes();
            Map<String, String> mdcContext = MDC.getCopyOfContextMap();
            return () -> {
                try {
                    RequestContextHolder.setRequestAttributes(context);
                    if (mdcContext != null) {
                        MDC.setContextMap(mdcContext);
                    }
                    // Execute asynchronous tasks
                    runnable.run();
                }
                catch (Exception e) {
                    log.error("Manual execution of asynchronous task exception", e);
                    throw e;
                }
                finally {
                    // reset after execution
                    log.info("reset async thread variable");
                    MDC.clear();
                    RequestContextHolder.resetRequestAttributes();
                }
            };
        });
        executor.initialize();
        log.info("create asynchronous task thread pool completed");
        return new LazyTraceExecutor(beanFactory, executor);
    }

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (ex, method, params) -> log.error("Annotating asynchronous task exceptions", ex);
    }
}
