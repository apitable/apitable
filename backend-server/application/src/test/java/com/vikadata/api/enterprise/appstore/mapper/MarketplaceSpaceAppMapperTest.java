package com.vikadata.api.enterprise.appstore.mapper;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.entity.MarketplaceSpaceAppRelEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 * Marketplace Space App Mapper Test
 * </p>
 */
public class MarketplaceSpaceAppMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    MarketplaceSpaceAppMapper marketPlaceSpaceAppMapper;

    @Test
    @Sql("/enterprise/sql/marketplace-space-app-rel-data.sql")
    void testSelectBySpaceIdAndAppId() {
        MarketplaceSpaceAppRelEntity entity = marketPlaceSpaceAppMapper.selectBySpaceIdAndAppId("spczdmQDfBAn5", "ina5645957505507647");
        assertThat(entity).isNotNull();
        assertThat(entity.getId()).isEqualTo(1385543224262451201L);
    }

}
