package com.apitable.shared.config;

import net.javacrumbs.shedlock.core.LockProvider;
import net.javacrumbs.shedlock.provider.redis.spring.RedisLockProvider;
import net.javacrumbs.shedlock.spring.annotation.EnableSchedulerLock;
import org.springframework.boot.task.ThreadPoolTaskSchedulerCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Shedlock configuration.
 *
 * @author Shawn Deng
 */
@Configuration(proxyBeanMethods = false)
@EnableScheduling
@EnableSchedulerLock(defaultLockAtMostFor = "10m")
public class ShedlockConfig {

    /**
     * spring task schedule customizer.
     *
     * @return TaskSchedulerCustomizer
     */
    @Bean
    public ThreadPoolTaskSchedulerCustomizer taskSchedulerCustomizer() {
        return taskScheduler -> {
            taskScheduler.setThreadNamePrefix("schedule-task-");
            taskScheduler.setWaitForTasksToCompleteOnShutdown(true);
        };
    }

    /**
     * define Lock Provider for ShedLock.
     *
     * @param connectionFactory redis connect factory
     * @return shedlock provider
     */
    @Bean
    public LockProvider lockProvider(RedisConnectionFactory connectionFactory) {
        return new RedisLockProvider(connectionFactory);
    }
}
