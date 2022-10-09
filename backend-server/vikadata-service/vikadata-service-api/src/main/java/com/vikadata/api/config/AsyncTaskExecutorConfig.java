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
 * 异步任务配置
 * 使用Spring框架封装好的线程池
 * ROLE_INFRASTRUCTURE: Spring框架自己的BEAN，与使用用户没有关系
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/9/6 15:46
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
        log.info("创建异步任务线程池");
        ThreadPoolTaskExecutor executor = new VisibleThreadPoolTaskExecutor();
        executor.setCorePoolSize(4);
        executor.setMaxPoolSize(50);
        executor.setQueueCapacity(500);
        executor.setKeepAliveSeconds(3000);
        executor.setThreadNamePrefix("vika-task-");
        // 线程池对拒绝任务的处理策略
        // rejection-policy：当pool已经达到max size的时候，拒绝处理新任务
        // CALLER_RUNS：不在新线程中执行任务，而是有调用者所在的线程来执行
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        // 请求上下文放入异步线程，异步任务上下文装饰器
        // 异步任务是一个单独的线程，与 Servlet 请求线程不在一起，所以主线程的上下文得传递过来
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
                    // 执行异步任务
                    runnable.run();
                }
                catch (Exception ex) {
                    if (!(ex instanceof BusinessException)) {
                        log.error("Manual execution of asynchronous task exception.", ex);
                    }
                    throw ex;
                }
                finally {
                    // 执行完成后重置
                    log.info("重置异步线程变量");
                    MDC.clear();
                    RequestContextHolder.resetRequestAttributes();
                    LocaleContextHolder.resetLocaleContext();
                    FeishuConfigStorageHolder.remove();
                    UserHolder.remove();
                }
            };
        });
        executor.initialize();
        log.info("创建异步任务线程池完毕");
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
