package com.vikadata.core.spring.task;

import java.util.concurrent.Callable;
import java.util.concurrent.Future;
import java.util.concurrent.ThreadPoolExecutor;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.util.concurrent.ListenableFuture;

/**
 * 汉化可视化线程池
 * @author Shawn Deng
 * @date 2021-05-25 18:31:11
 */
public class VisibleThreadPoolTaskExecutor extends ThreadPoolTaskExecutor {

    protected final Log logger = LogFactory.getLog(getClass());

    private void showThreadPoolInfo(String prefix) {
        ThreadPoolExecutor threadPoolExecutor = getThreadPoolExecutor();
        logger.info("线程名称" + this.getThreadNamePrefix() + prefix
            + ", 任务总数量: " + threadPoolExecutor.getTaskCount()
            + ", 已完成任务数量: " + threadPoolExecutor.getCompletedTaskCount()
            + ", 正在活动线程任务数量:" + threadPoolExecutor.getActiveCount()
            + ", 缓冲线程队列数量: " + threadPoolExecutor.getQueue().size());
    }

    @Override
    public void execute(Runnable task) {
        showThreadPoolInfo("执行任务");
        super.execute(task);
    }

    @Override
    public void execute(Runnable task, long startTimeout) {
        showThreadPoolInfo(String.format("执行任务[Timeout:%d]", startTimeout));
        super.execute(task, startTimeout);
    }

    @Override
    public Future<?> submit(Runnable task) {
        showThreadPoolInfo("执行有状态的任务");
        return super.submit(task);
    }

    @Override
    public <T> Future<T> submit(Callable<T> task) {
        showThreadPoolInfo("执行有状态的任务");
        return super.submit(task);
    }

    @Override
    public ListenableFuture<?> submitListenable(Runnable task) {
        showThreadPoolInfo("提交线程任务监听器");
        return super.submitListenable(task);
    }

    @Override
    public <T> ListenableFuture<T> submitListenable(Callable<T> task) {
        showThreadPoolInfo("提交线程任务回调监听器");
        return super.submitListenable(task);
    }
}
