package com.apitable.user.task;

import static net.javacrumbs.shedlock.core.LockAssert.assertLocked;

import com.apitable.shared.clock.spring.ClockManager;
import com.apitable.shared.config.properties.ConstProperties;
import com.apitable.user.service.IUserService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;

/**
 * user task class.
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnProperty(value = "system.test-enabled", havingValue = "false", matchIfMissing = true)
@Slf4j
public class UserTasks {

    @Resource
    private IUserService iUserService;

    @Resource
    private ConstProperties constProperties;

    /**
     * Closing accounts pending cancellation beyond the cooling-off period.
     * cron: 0 0 0 * * ?
     * preview execute desc: ****-03-07 00:00:00, ****-03-08 00:00:00, ****-03-09 00:00:00
     */
    @Scheduled(cron = "${CLOSE_PAUSED_USER_CRON:0 0 0 * * ?}")
    @SchedulerLock(name = "closePausedUser", lockAtMostFor = "1h", lockAtLeastFor = "30m")
    public void closePausedUser() {
        assertLocked();
        log.info("beginCloseUser:{}", ClockManager.me().getLocalDateTimeNow());
        iUserService.closePausedUser(constProperties.getCoolingOffPeriod());
        log.info("UserClosed:{}", ClockManager.me().getLocalDateTimeNow());
    }
}

