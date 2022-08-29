package com.vikadata.schedule.space.service;

import javax.annotation.Resource;

import groovy.util.logging.Slf4j;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.scheduler.space.SchedulerSpaceApplication;
import com.vikadata.scheduler.space.service.IDingTalkConfigService;

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
public class DingTalkTest {
    @Resource
    private IDingTalkConfigService dingTalkConfigService;

    @Test
    public void testAddDingTalkAgentApps() {
        // 测试读取配置并添加配置到redis
        dingTalkConfigService.saveDingTalkAgentAppConfig("");
    }

    @Test
    public void testAddDingTalkGoodsInfo() {
        // 测试读取配置并添加配置到redis
        dingTalkConfigService.saveDingTalkGoodsConfig("usk8qo1Dk9PbecBlaqFIvbb", "https://integration.vika.ltd", "dstSEJ8n5pbw0BRXrz",
                "dstPk1T9caJRry774J");
    }

    @Test
    public void testSaveDingTalkDaTemplateInfo() {
        dingTalkConfigService.saveDingTalkDaTemplateConfig("dstf9lEYwPJ0uAkic8", "viwq9fTx0t8pm");
    }
}
