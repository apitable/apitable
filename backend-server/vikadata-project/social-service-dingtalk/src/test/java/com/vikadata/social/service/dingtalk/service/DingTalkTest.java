package com.vikadata.social.service.dingtalk.service;

import java.util.concurrent.ThreadPoolExecutor;

import javax.annotation.Resource;

import cn.hutool.core.thread.ThreadUtil;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.social.dingtalk.model.DingTalkUserListResponse;
import com.vikadata.social.service.dingtalk.SocialDingTalkApplication;

import org.springframework.boot.test.context.SpringBootTest;

@Disabled("no assertion")
@Slf4j
@SpringBootTest(classes = SocialDingTalkApplication.class)
public class DingTalkTest {

    @Resource
    private IDingTalkService iDingTalkService;

    @Test
    public void testApiLimitPool() {
        // Test DingTalk api current limit
        ThreadPoolExecutor threadPoolExecutor = ThreadUtil.newExecutorByBlockingCoefficient((float) 0.9f);
        log.info("Number of threads: {}", threadPoolExecutor.getCorePoolSize());
        threadPoolExecutor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        for (int i = 0; i < 50; i++) {
            threadPoolExecutor.execute(() -> {
                DingTalkUserListResponse response = iDingTalkService.getUserDetailList("20303001",
                        "dinga39a6d188d0e7fddbc961a6cb783455b", 1L, 0,
                        100);
                log.info("Return data: {}", JSONUtil.toJsonStr(response));
            });
        }
        ThreadUtil.sleep(10000000);
    }
}
