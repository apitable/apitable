package com.vikadata.scheduler.bill.handler;

import javax.annotation.Resource;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;

/**
 *
 * @author Shawn Deng
 * @date 2021-12-28 11:13:38
 */
@Disabled("no assertion")
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class WhiteListHandlerTest {

    @Resource
    private WhiteListHandler whiteListHandler;

    @Test
    void testSyncBilling() throws Exception {
        whiteListHandler.syncWhiteList();
    }

    @Test
    void testNewOrder() throws Exception {
        whiteListHandler.newOrderHandler();
    }
}
