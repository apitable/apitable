package com.vikadata.api.component;

import java.util.concurrent.Executor;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;

import org.springframework.stereotype.Component;

import static com.vikadata.api.config.AsyncTaskExecutorConfig.DEFAULT_EXECUTOR_BEAN_NAME;

/**
 * <p>
 * 异步线程任务管理器
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/4/22 16:10
 */
@Component
@Slf4j
public class TaskManager {

    public static TaskManager me() {
        return SpringContextHolder.getBean(TaskManager.class);
    }

    /**
     * 执行线程任务
     * 无返回值
     */
    public void execute(Runnable runnable) {
        SpringContextHolder.getBean(DEFAULT_EXECUTOR_BEAN_NAME, Executor.class).execute(runnable);
    }
}
