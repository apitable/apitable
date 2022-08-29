package com.vikadata.social.service.dingtalk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/**
 * 启动入口
 *
 * @author Zoe Zheng
 * @date 2021-08-26 14:00:38
 */
@SpringBootApplication
@ConfigurationPropertiesScan
public class SocialDingTalkApplication {

    public static void main(String[] args) {
        SpringApplication.run(SocialDingTalkApplication.class, args);
    }
}