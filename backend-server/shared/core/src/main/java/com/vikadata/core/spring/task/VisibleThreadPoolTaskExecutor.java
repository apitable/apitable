package com.vikadata.core.spring.task;

import java.util.concurrent.Callable;
import java.util.concurrent.Future;
import java.util.concurrent.ThreadPoolExecutor;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.util.concurrent.ListenableFuture;

/**
 * custom thread pool
 */
public class VisibleThreadPoolTaskExecutor extends ThreadPoolTaskExecutor {

    protected final Log logger = LogFactory.getLog(getClass());

    private void showThreadPoolInfo(String prefix) {
        ThreadPoolExecutor threadPoolExecutor = getThreadPoolExecutor();
        logger.info("Thread name: " + this.getThreadNamePrefix() + prefix
            + ", the total number of tasks: " + threadPoolExecutor.getTaskCount()
            + ", the number of completed tasks: " + threadPoolExecutor.getCompletedTaskCount()
            + ", the number of executing threads:" + threadPoolExecutor.getActiveCount()
            + ", the number of tasks in the task queue: " + threadPoolExecutor.getQueue().size());
    }

    @Override
    public void execute(Runnable task) {
        showThreadPoolInfo("execute task");
        super.execute(task);
    }

    @Override
    public void execute(Runnable task, long startTimeout) {
        showThreadPoolInfo(String.format("execute task [Timeout:%d]", startTimeout));
        super.execute(task, startTimeout);
    }

    @Override
    public Future<?> submit(Runnable task) {
        showThreadPoolInfo("execute stateful tasks");
        return super.submit(task);
    }

    @Override
    public <T> Future<T> submit(Callable<T> task) {
        showThreadPoolInfo("execute stateful tasks");
        return super.submit(task);
    }

    @Override
    public ListenableFuture<?> submitListenable(Runnable task) {
        showThreadPoolInfo("submit thread task listener");
        return super.submitListenable(task);
    }

    @Override
    public <T> ListenableFuture<T> submitListenable(Callable<T> task) {
        showThreadPoolInfo("submit thread task callback listener");
        return super.submitListenable(task);
    }
}
