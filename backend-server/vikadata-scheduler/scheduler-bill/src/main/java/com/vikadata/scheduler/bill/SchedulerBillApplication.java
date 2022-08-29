package com.vikadata.scheduler.bill;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/**
 * <p>
 * 启动入口
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/9/14 16:31
 */
@SpringBootApplication
@ConfigurationPropertiesScan
public class SchedulerBillApplication {

    public static void main(String[] args) {
        SpringApplication.run(SchedulerBillApplication.class, args);
    }
}
