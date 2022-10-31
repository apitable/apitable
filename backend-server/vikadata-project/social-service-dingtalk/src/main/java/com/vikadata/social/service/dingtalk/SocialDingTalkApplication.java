package com.vikadata.social.service.dingtalk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class SocialDingTalkApplication {

    public static void main(String[] args) {
        SpringApplication.run(SocialDingTalkApplication.class, args);
    }
}