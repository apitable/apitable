package com.vikadata.scheduler.space;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/**
 * <p>
 * 启动类
 * </p>
 *
 * @author Chambers
 * @date 2019/11/20
 */
@SpringBootApplication
@ConfigurationPropertiesScan
public class SchedulerSpaceApplication {

    public static void main(String[] args) {
        SpringApplication.run(SchedulerSpaceApplication.class, args);
    }
}
