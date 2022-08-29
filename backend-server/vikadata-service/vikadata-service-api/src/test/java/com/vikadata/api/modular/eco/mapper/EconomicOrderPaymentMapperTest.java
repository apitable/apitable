package com.vikadata.api.modular.eco.mapper;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.entity.EconomicOrderPaymentEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <P>
 *     数据访问层测试：经济模块-订单付款记录表测试
 * </P>
 *
 * @author wuyitao
 * @date 2022/3/30 6:28 PM
 */
public class EconomicOrderPaymentMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    EconomicOrderPaymentMapper economicOrderPaymentMapper;

    @Test
    @Sql("/testdata/economic-order-payment-data.sql")
    void testSelectByTransactionNo() {
        EconomicOrderPaymentEntity entity = economicOrderPaymentMapper.selectByTransactionNo("2022021812195075580");
        assertThat(entity).isNotNull();
        assertThat(entity.getOrderNo()).isEqualTo("20220218121950344556");
    }
}
