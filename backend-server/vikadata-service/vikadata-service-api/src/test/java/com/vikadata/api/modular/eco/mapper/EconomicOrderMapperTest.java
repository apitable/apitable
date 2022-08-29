package com.vikadata.api.modular.eco.mapper;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.entity.EconomicOrderEntity;

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
public class EconomicOrderMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    EconomicOrderMapper economicOrderMapper;

    @Test
    @Sql("/testdata/economic-order-data.sql")
    void testSelectByOrderNo() {
        EconomicOrderEntity entity = economicOrderMapper.selectByOrderNo("20220218121950344556");
        assertThat(entity).isNotNull();
        assertThat(entity.getOrderNo()).isEqualTo("20220218121950344556");
    }

    @Test
    @Sql("/testdata/economic-order-data.sql")
    void testSelectBySpaceId() {
        List<EconomicOrderEntity> entity = economicOrderMapper.selectBySpaceId("spczdmQDfBAn5");
        assertThat(entity).isNotEmpty();
    }

    @Test
    @Sql("/testdata/economic-order-data.sql")
    void testSelectCountBySpaceIdChannelOrderId() {
        Integer count = economicOrderMapper.selectCountBySpaceIdChannelOrderId("spcAqREDX25Vw", "7073056690173640708");
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/economic-order-data.sql")
    void testSelectBySpaceIdChannelOrderId() {
        EconomicOrderEntity entity = economicOrderMapper.selectBySpaceIdChannelOrderId("spcAqREDX25Vw", "7073056690173640708");
        assertThat(entity).isNotNull();
        assertThat(entity.getSpaceId()).isEqualTo("spcAqREDX25Vw");
    }

}
