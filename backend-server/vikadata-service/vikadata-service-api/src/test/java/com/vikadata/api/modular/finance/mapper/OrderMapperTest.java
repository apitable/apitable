package com.vikadata.api.modular.finance.mapper;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.entity.OrderEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     数据访问层测试：经济模块-订单表测试
 * </p>
 *
 * @author wuyitao
 * @date 2022/3/30 6:12 PM
 */
public class OrderMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    OrderMapper orderMapper;

    @Test
    @Sql("/testdata/order-data.sql")
    void testSelectByOrderId() {
        OrderEntity entity = orderMapper.selectByOrderId("20220516231241494813");
        assertThat(entity).isNotNull();
        assertThat(entity.getOrderId()).isEqualTo("20220516231241494813");
    }
}
