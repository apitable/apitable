package com.vikadata.api.shared.config;

import java.util.Map;
import java.util.concurrent.ThreadPoolExecutor;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;

import com.vikadata.api.shared.holder.UserHolder;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.social.feishu.FeishuConfigStorageHolder;

import org.springframework.boot.task.TaskExecutorCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.i18n.LocaleContext;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.core.task.TaskDecorator;
import org.springframework.scheduling.annotation.EnableAsync;
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
@Slf4j
@EnableAsync
public class TaskExecutionConfig {

    @Bean
    TaskExecutorCustomizer taskExecutorCustomizer() {
        return executor -> {
            executor.setCorePoolSize(4);
            executor.setMaxPoolSize(50);
            executor.setQueueCapacity(500);
            executor.setKeepAliveSeconds(3000);
            executor.setThreadNamePrefix("thread-task-");
            executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        };
    }

    @Bean
    TaskDecorator taskDecorator() {
        return runnable -> {
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
                        log.error("execution of asynchronous task exception.", ex);
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
        };
    }
}
