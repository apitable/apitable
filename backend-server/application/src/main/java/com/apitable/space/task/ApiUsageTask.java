package com.apitable.space.task;

import static com.apitable.core.constants.RedisConstants.getApiUsageTableDayMindIdCacheKey;
import static com.apitable.shared.util.DateHelper.SIMPLE_DATE;
import static net.javacrumbs.shedlock.core.LockAssert.assertLocked;

import com.apitable.space.mapper.StaticsMapper;
import jakarta.annotation.Resource;
import java.time.LocalDate;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;

/**
 * api usage task.
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnProperty(value = "system.test-enabled", havingValue = "false", matchIfMissing = true)
@Slf4j
public class ApiUsageTask {
    @Resource
    private RedisTemplate<String, Long> redisTemplate;

    @Resource
    private StaticsMapper staticsMapper;

    /**
     * get api usage table min id at beginning of every day.
     * cron: 0 0 0 * * ?
     */
    @Scheduled(cron = "0 0 0 * * ?")
    @SchedulerLock(name = "setEveryDayApiUsageMindId", lockAtMostFor = "1h", lockAtLeastFor = "30m")
    public void setEveryDayApiUsageMindId() {
        assertLocked();
        String key = getApiUsageTableDayMindIdCacheKey(LocalDate.now().format(SIMPLE_DATE));
        Long maxId = staticsMapper.selectApiUsageMaxId();
        redisTemplate.opsForValue().setIfAbsent(key, maxId, 2, TimeUnit.DAYS);
        log.info("setEveryDayApiUsageMindId:{}", maxId);
    }
}
