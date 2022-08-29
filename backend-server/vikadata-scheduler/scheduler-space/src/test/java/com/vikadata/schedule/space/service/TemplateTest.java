package com.vikadata.schedule.space.service;

import javax.annotation.Resource;

import groovy.util.logging.Slf4j;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.scheduler.space.SchedulerSpaceApplication;
import com.vikadata.scheduler.space.service.ITemplateService;

import org.springframework.boot.test.context.SpringBootTest;

/**
 * test
 *
 * @author Zoe Zheng
 * @date 2021-07-26 20:17:12
 */
@Disabled("no assertion")
@Slf4j
@SpringBootTest(classes = SchedulerSpaceApplication.class)
public class TemplateTest {
    @Resource
    private ITemplateService templateService;

    @Test
    public void testSyncTemplate() {
        // 读取redis配置并且添加进数据库
        templateService.syncTemplate();
    }
}
