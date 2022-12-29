package com.vikadata.social.service.dingtalk.component;

import java.util.concurrent.Executor;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.core.util.SpringContextHolder;

import org.springframework.stereotype.Component;

import static com.vikadata.social.service.dingtalk.config.AsyncTaskExecutorConfig.DEFAULT_EXECUTOR_BEAN_NAME;

@Component
@Slf4j
public class TaskManager {

    public static TaskManager me() {
        return SpringContextHolder.getBean(TaskManager.class);
    }

    public void execute(Runnable runnable) {
        SpringContextHolder.getBean(DEFAULT_EXECUTOR_BEAN_NAME, Executor.class).execute(runnable);
    }
}
