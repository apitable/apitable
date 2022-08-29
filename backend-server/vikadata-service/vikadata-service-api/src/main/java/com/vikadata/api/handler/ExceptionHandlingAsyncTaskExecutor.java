package com.vikadata.api.handler;

import java.util.concurrent.Callable;
import java.util.concurrent.Future;

import io.sentry.Sentry;
import lombok.extern.slf4j.Slf4j;

import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.core.task.AsyncTaskExecutor;

/**
 * <p>
 * 异步执行器加强
 * 处理线程任务异常
 * 已废弃，使用 {@link AsyncUncaughtExceptionHandler} 即可，不用再次包装
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/9/6 15:51
 */
@Deprecated
@Slf4j
public class ExceptionHandlingAsyncTaskExecutor implements AsyncTaskExecutor, InitializingBean, DisposableBean {

    private final AsyncTaskExecutor executor;

    /**
     * Instantiates a new Exception handling async task executor.
     *
     * @param executor the executor
     */
    public ExceptionHandlingAsyncTaskExecutor(AsyncTaskExecutor executor) {
        this.executor = executor;
    }

    /**
     * Execute.
     *
     * @param task the task
     */
    @Override
    public void execute(Runnable task) {
        executor.execute(createExceptionWrappedRunnable(task));
    }

    /**
     * Execute.
     *
     * @param task         the task
     * @param startTimeout the start timeout
     */
    @Override
    public void execute(Runnable task, long startTimeout) {
        executor.execute(createExceptionWrappedRunnable(task), startTimeout);
    }

    /**
     * 包装Callable处理异常
     *
     * @param task Callable Task
     * @param <T>  generic return type
     * @return callable return
     */
    private <T> Callable<T> createExceptionWrappedCallable(final Callable<T> task) {
        return () -> {
            try {
                return task.call();
            }
            catch (Exception e) {
                handle(e);
                throw e;
            }
        };
    }

    /**
     * 包装Runnable处理异常
     *
     * @param task Runnable task
     * @return return Runnable instance
     */
    private Runnable createExceptionWrappedRunnable(final Runnable task) {
        return () -> {
            try {
                task.run();
            }
            catch (Exception e) {
                handle(e);
                throw e;
            }
        };
    }

    /**
     * 抓取异常
     *
     * @param e the e
     */
    private void handle(Exception e) {
        log.error("Caught async exception", e);
        Sentry.captureException(e);
    }

    /**
     * Submit future.
     *
     * @param task the task
     * @return the future
     */
    @Override
    public Future<?> submit(Runnable task) {
        return executor.submit(createExceptionWrappedRunnable(task));
    }

    /**
     * Submit future.
     *
     * @param <T>  the type parameter
     * @param task the task
     * @return the future
     */
    @Override
    public <T> Future<T> submit(Callable<T> task) {
        return executor.submit(createExceptionWrappedCallable(task));
    }

    /**
     * Destroy.
     *
     * @throws Exception the exception
     */
    @Override
    public void destroy() throws Exception {
        if (executor instanceof DisposableBean) {
            DisposableBean bean = (DisposableBean) executor;
            bean.destroy();
        }
    }

    /**
     * After properties set.
     *
     * @throws Exception the exception
     */
    @Override
    public void afterPropertiesSet() throws Exception {
        if (executor instanceof InitializingBean) {
            InitializingBean bean = (InitializingBean) executor;
            bean.afterPropertiesSet();
        }
    }
}
