package com.vikadata.schedule.space.service;

import javax.annotation.Resource;

import cn.hutool.core.lang.ConsoleTable;
import groovy.util.logging.Slf4j;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.scheduler.space.SchedulerSpaceApplication;
import com.vikadata.scheduler.space.handler.RoomIpHealthIndicatorJobHandler;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.test.context.ActiveProfiles;

@Disabled("no assertion")
@Slf4j
@SpringBootTest(classes = SchedulerSpaceApplication.class)
@EnableScheduling
@ActiveProfiles("local")
public class RoomIpHealthIndicatorTest {

    @Resource
    private RoomIpHealthIndicatorJobHandler roomIpHealthIndicatorJobHandler;

    @Scheduled(cron = "*/3 * * * * ?")
    public void execute() {
        roomIpHealthIndicatorJobHandler.execute();
    }

    @Test
    public void testMain() {
        try {
            Thread.sleep(30000000L);
        }
        catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    @Disabled("no assertion")
    public static class JobTest {

        @Test
        public void test1() {
            ConsoleTable consoleTable = ConsoleTable.create()
                    .addHeader("　Room Ip List")
                    .addBody("192.168.111.111")
                    .addBody("192.168.1.2");
            System.out.println(consoleTable.toString());
        }

    }

}
