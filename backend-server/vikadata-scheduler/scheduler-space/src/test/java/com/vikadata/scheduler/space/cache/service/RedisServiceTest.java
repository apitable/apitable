package com.vikadata.scheduler.space.cache.service;

import javax.annotation.Resource;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.scheduler.space.SchedulerSpaceApplication;

import org.springframework.boot.test.context.SpringBootTest;

@Disabled("no assertion")
@SpringBootTest(classes = SchedulerSpaceApplication.class)
public class RedisServiceTest {

    @Resource
    private RedisService redisService;

    @Test
    public void refreshApiUsageNextMonthMinId() {
        redisService.refreshApiUsageNextMonthMinId();
    }
}