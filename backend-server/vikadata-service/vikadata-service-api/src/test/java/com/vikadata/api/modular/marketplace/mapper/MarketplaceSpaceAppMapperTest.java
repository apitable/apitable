package com.vikadata.api.modular.marketplace.mapper;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.entity.MarketplaceSpaceAppRelEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     数据访问层测试：应用市场-空间与应用开通记录表测试
 * </p>
 *
 * @author wuyitao
 * @date 2022/3/31 3:18 PM
 */
public class MarketplaceSpaceAppMapperTest extends AbstractMyBatisMapperTest {


    @Autowired
    MarketplaceSpaceAppMapper marketPlaceSpaceAppMapper;

    @Test
    @Sql("/testdata/marketplace-space-app-rel-data.sql")
    void testSelectBySpaceIdAndAppId() {
        MarketplaceSpaceAppRelEntity entity = marketPlaceSpaceAppMapper.selectBySpaceIdAndAppId("spczdmQDfBAn5", "ina5645957505507647");
        assertThat(entity).isNotNull();
        assertThat(entity.getId()).isEqualTo(1385543224262451201L);
    }

}
