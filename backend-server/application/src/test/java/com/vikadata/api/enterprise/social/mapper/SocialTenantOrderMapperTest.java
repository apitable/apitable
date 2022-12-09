package com.vikadata.api.enterprise.social.mapper;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.enterprise.social.mapper.SocialTenantOrderMapper;
import com.vikadata.api.enterprise.social.enums.SocialPlatformType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     Data access layer test: third-party platform integration - order table test
 * </p>
 */
public class SocialTenantOrderMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SocialTenantOrderMapper socialTenantOrderMapper;

    @Test
    @Sql("/testdata/social-tenant-order-data.sql")
    void testSelectCountByChannelOrderId() {
        Integer count = socialTenantOrderMapper.selectCountByChannelOrderId("coi41", "ww41", "ai41", SocialPlatformType.DINGTALK);
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/social-tenant-order-data.sql")
    void testSelectOrderDataByTenantIdAndAppId() {
        List<String> orderData = socialTenantOrderMapper.selectOrderDataByTenantIdAndAppId("ww41", "ai41", SocialPlatformType.DINGTALK);
        assertThat(orderData).isNotEmpty();
    }

}
