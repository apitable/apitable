package com.vikadata.api.enterprise.billing.mapper;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.enterprise.billing.entity.OrderEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 * Subscription Billing System - Order Mapper Test
 * </p>
 */
public class OrderMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    OrderMapper orderMapper;

    @Test
    @Sql("/enterprise/sql/order-data.sql")
    void testSelectByOrderId() {
        OrderEntity entity = orderMapper.selectByOrderId("20220516231241494813");
        assertThat(entity).isNotNull();
        assertThat(entity.getOrderId()).isEqualTo("20220516231241494813");
    }
}
