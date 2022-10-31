package com.vikadata.schedule.space.service;

import javax.annotation.Resource;

import groovy.util.logging.Slf4j;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.scheduler.space.SchedulerSpaceApplication;
import com.vikadata.scheduler.space.service.IDingTalkConfigService;

import org.springframework.boot.test.context.SpringBootTest;

@Disabled("no assertion")
@Slf4j
@SpringBootTest(classes = SchedulerSpaceApplication.class)
public class DingTalkTest {
    @Resource
    private IDingTalkConfigService dingTalkConfigService;

    @Test
    public void testAddDingTalkAgentApps() {
        dingTalkConfigService.saveDingTalkAgentAppConfig("");
    }

    @Test
    public void testSaveDingTalkDaTemplateInfo() {
        dingTalkConfigService.saveDingTalkDaTemplateConfig("dstf9lEYwPJ0uAkic8", "viwq9fTx0t8pm");
    }
}
