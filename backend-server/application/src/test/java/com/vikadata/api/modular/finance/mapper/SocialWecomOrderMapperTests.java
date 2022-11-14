package com.vikadata.api.modular.finance.mapper;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.enterprise.billing.mapper.SocialWecomOrderMapper;
import com.vikadata.entity.SocialWecomOrderEntity;

import org.springframework.test.context.jdbc.Sql;

/**
 * <p>
 * Subscription Billing System - Wecom Order Mapper Test
 * </p>
 */
class SocialWecomOrderMapperTests extends AbstractMyBatisMapperTest {

    @Resource
    private SocialWecomOrderMapper socialWecomOrderMapper;

    @Test
    @Sql("/testdata/social-wecom-order-data.sql")
    void selectAllOrdersTest() {
        // test without orderStatuses
        List<SocialWecomOrderEntity> orderEntities = socialWecomOrderMapper
                .selectAllOrders("testSuiteId", "testPaidCorpId", null);
        Assertions.assertTrue(CollUtil.isNotEmpty(orderEntities));
        // test with one orderStatus
        orderEntities = socialWecomOrderMapper
                .selectAllOrders("testSuiteId", "testPaidCorpId", Collections.singletonList(1));
        Assertions.assertTrue(CollUtil.isNotEmpty(orderEntities));
        // test with one more orderStatuses
        orderEntities = socialWecomOrderMapper
                .selectAllOrders("testSuiteId", "testPaidCorpId", Arrays.asList(0, 1));
        Assertions.assertTrue(CollUtil.isNotEmpty(orderEntities));
    }

    @Test
    @Sql("/testdata/social-wecom-order-data.sql")
    void selectByOrderIdTest() {
        // test not existed
        SocialWecomOrderEntity orderEntity = socialWecomOrderMapper.selectByOrderId("testOrderId");
        Assertions.assertNull(orderEntity);
        // test existed
        orderEntity = socialWecomOrderMapper.selectByOrderId("testOrderId1");
        Assertions.assertNotNull(orderEntity);
    }

    @Test
    @Sql("/testdata/social-wecom-order-data.sql")
    void selectFirstPaidOrderTest() {
        // test not existed
        SocialWecomOrderEntity orderEntity = socialWecomOrderMapper.selectFirstPaidOrder("testSuiteId", "testPaidCorpId1");
        Assertions.assertNull(orderEntity);
        // test existed
        orderEntity = socialWecomOrderMapper.selectFirstPaidOrder("testSuiteId", "testPaidCorpId");
        Assertions.assertNotNull(orderEntity);
    }

    @Test
    @Sql("/testdata/social-wecom-order-data.sql")
    void selectLastPaidOrderTest() {
        // test not existed
        SocialWecomOrderEntity orderEntity = socialWecomOrderMapper.selectLastPaidOrder("testSuiteId", "testPaidCorpId1");
        Assertions.assertNull(orderEntity);
        // test existed
        orderEntity = socialWecomOrderMapper.selectLastPaidOrder("testSuiteId", "testPaidCorpId");
        Assertions.assertNotNull(orderEntity);
    }

}
