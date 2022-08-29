package com.vikadata.api.modular.social.mapper;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.enums.social.SocialPlatformType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     数据访问层测试：第三方平台集成-订单表测试
 * </p>
 *
 * @author wuyitao
 * @date 2022/4/4 4:43 PM
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
